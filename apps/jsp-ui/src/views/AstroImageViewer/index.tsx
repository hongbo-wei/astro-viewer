import { EyeOutlined } from '@ant-design/icons'
import { Card, Button, Checkbox, List, Typography, Row, Col, Alert } from 'antd'
import React, { useState, useRef } from 'react'

import CelestialSphere from '@/components/CelestialSphere'
import { getRaDecByRaycast, pixelToRaDec } from '@/utils/raycastUtils'
import { TELESCOPE_FILTER_DB_MAP } from '@/constants/telescopeDbMap'

import style from './index.module.scss'
import SelectionBox from '@/components/SelectionBox'
const { Title, Text } = Typography

interface FilterOption {
  key: string
  label: string
  checked: boolean
}

interface RetrievedItem {
  id: string
  name: string
}

interface RetrievedImage {
  id: string
  url: string
  title: string
}

interface TelescopeOption {
  key: string
  label: string
  selected: boolean
}

const AstroImageViewer: React.FC = () => {
  // JSP image display state
  const [showJspImage, setShowJspImage] = useState(false)
  // Fullscreen modal for JSP image
  const [jspModalVisible, setJspModalVisible] = useState(false)
  // Use dummy image for JSP display
  const JSP_IMAGE_PATH = '/dummy-jsp-image.png' // Place the provided image in public/ as dummy-jsp-image.png
  const mainImageRef = useRef<HTMLDivElement>(null)
  const celestialRef = useRef<any>(null)
  // 已移除 worldPosition 变量（未被使用）
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [lastSelectionCorners, setLastSelectionCorners] = useState<Array<{ ra: number; dec: number }>>([])
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
  const [currentSelection, setCurrentSelection] = useState<{ x: number; y: number } | null>(null)

  // Telescope selection state - sorted alphabetically by ASCII
  const [telescopes, setTelescopes] = useState<TelescopeOption[]>([
    { key: 'twomass', label: '2MASS', selected: false },
    { key: 'desi', label: 'DESI', selected: false },
    { key: 'euclid', label: 'Euclid', selected: false },
    { key: 'wise', label: 'WISE', selected: false },
  ])
  // Helper to get selected filters for each telescope
  const getSelectedFilters = () => {
    return {
      '2MASS': twoMassFilters.filter((f) => f.checked).map((f) => f.key),
      DESI: desiFilters.filter((f) => f.checked).map((f) => f.key),
      Euclid: euclidFilters.filter((f) => f.checked).map((f) => f.key),
      WISE: wiseFilters.filter((f) => f.checked).map((f) => f.key),
    }
  }

  // Helper: parse previewData to region array
  const getRegionFromPreview = () => {
    // previewData: ["RA: 64.434°, Dec: 19.023°", ...]
    return previewData
      .map((item) => {
        const match = item.match(/RA:\s*([\d.-]+)[^\d]+Dec:\s*([\d.-]+)/)
        if (match) {
          return {
            ra: parseFloat(match[1] ?? ''),
            dec: parseFloat(match[2] ?? ''),
          }
        }
        return null
      })
      .filter(Boolean)
  }

  // Prepare payload for Retrieve action (separate Telescopes/Filters and Coordinations)
  const prepareRetrievePayload = () => {
    const selectedTelescopes = telescopes
      .filter((t) => t.selected)
      .map((t) => t.label)
    const selectedFilters = getSelectedFilters()
    const coordinations = lastSelectionCorners.length > 0 ? lastSelectionCorners : []
    // Always return both keys, with empty array if nothing selected
    const telescopesAndFilters = selectedTelescopes.map((telescope) => {
      const map = TELESCOPE_FILTER_DB_MAP[telescope]
      return {
        telescope,
        db: map?.db,
        column: map?.column,
        filters: selectedFilters[telescope] || [],
      }
    })
    return {
      telescopesAndFilters,
      coordinations,
    }
  }

  // Updated filter data to match specifications - sorted alphabetically by ASCII
  const [euclidFilters, setEuclidFilters] = useState<FilterOption[]>([
    { key: 'DECAM_g', label: 'DECAM_g', checked: false },
    { key: 'DECAM_i', label: 'DECAM_i', checked: false },
    { key: 'DECAM_r', label: 'DECAM_r', checked: false },
    { key: 'DECAM_z', label: 'DECAM_z', checked: false },
    { key: 'HSC_g', label: 'HSC_g', checked: false },
    { key: 'HSC_z', label: 'HSC_z', checked: false },
    { key: 'MEGACAM_r', label: 'MEGACAM_r', checked: false },
    { key: 'MEGACAM_u', label: 'MEGACAM_u', checked: false },
    { key: 'NIR_H', label: 'NIR_H', checked: false },
    { key: 'NIR_J', label: 'NIR_J', checked: false },
    { key: 'NIR_Y', label: 'NIR_Y', checked: false },
    { key: 'PANSTARRS_i', label: 'PANSTARRS_i', checked: false },
  ])

  const [wiseFilters, setWiseFilters] = useState<FilterOption[]>([
    { key: '1', label: '1', checked: false },
    { key: '2', label: '2', checked: false },
    { key: '3', label: '3', checked: false },
    { key: '4', label: '4', checked: false },
  ])

  const [twoMassFilters, setTwoMassFilters] = useState<FilterOption[]>([
    { key: 'h', label: 'h', checked: false },
    { key: 'j', label: 'j', checked: false },
    { key: 'k', label: 'k', checked: false },
  ])

  const [desiFilters, setDesiFilters] = useState<FilterOption[]>([
    { key: 'W1', label: 'W1', checked: false },
    { key: 'W2', label: 'W2', checked: false },
    { key: 'W3', label: 'W3', checked: false },
    { key: 'W4', label: 'W4', checked: false },
    { key: 'g', label: 'g', checked: false },
    { key: 'i', label: 'i', checked: false },
    { key: 'r', label: 'r', checked: false },
    { key: 'z', label: 'z', checked: false },
  ])

  const [retrievedData] = useState<RetrievedItem[]>([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    { id: '4', name: 'View More' },
  ])

  const [retrievedImages] = useState<RetrievedImage[]>([
    { id: '1', url: '/api/placeholder/150/100', title: 'Image 1' },
    { id: '2', url: '/api/placeholder/150/100', title: 'Image 2' },
    { id: '3', url: '/api/placeholder/150/100', title: 'Image 3' },
    { id: '4', url: '/api/placeholder/150/100', title: 'Image 4' },
    { id: '5', url: '/api/placeholder/150/100', title: 'Image 5' },
  ])

  const [previewData, setPreviewData] = useState<string[]>([
    'RA: , Dec: ',
    'RA: , Dec: ',
    'RA: , Dec: ',
    'RA: , Dec: ',
  ])

  // 新增：用于测试窗口的 state
  const [testLog, setTestLog] = useState<any>(null)

  const handleFilterChange = (
    filterType: 'euclid' | 'wise' | 'twomass' | 'desi',
    key: string,
    checked: boolean,
  ) => {
    const setters = {
      euclid: setEuclidFilters,
      wise: setWiseFilters,
      twomass: setTwoMassFilters,
      desi: setDesiFilters,
    }
    setters[filterType]((prev) =>
      prev.map((filter) =>
        filter.key === key ? { ...filter, checked } : filter,
      ),
    )
  }

  const handleTelescopeChange = (key: string, selected: boolean) => {
    setTelescopes((prev) =>
      prev.map((telescope) =>
        telescope.key === key ? { ...telescope, selected } : telescope,
      ),
    )
  }

  // 鼠标移动时，统一用 pixelToRaDec 计算 RA/Dec，基准以 mainImageRef 为准
  const [hoverRaDec, setHoverRaDec] = useState<{ ra: number; dec: number } | null>(null)
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mainImageRef.current && celestialRef.current && celestialRef.current.getCamera && celestialRef.current.getSphere) {
      const rect = mainImageRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      // 悬浮坐标
      const raDec = pixelToRaDec(x, y, mainImageRef, celestialRef.current.getCamera(), celestialRef.current.getSphere())
      setHoverRaDec(raDec)
      // SelectionBox 框选实时更新
      if (isSelectionMode && selectionStart) {
        setCurrentSelection({ x, y })
      }
    }
  }

  // 处理3D射线投射结果 - 使用统一的坐标转换工具
  // 已移除 handleRaycast 内对 worldPosition 的操作（未被使用）
  const handleRaycast = () => {
    // no-op
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelectionMode && mainImageRef.current) {
      const rect = mainImageRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setSelectionStart({ x, y })
      setCurrentSelection({ x, y })
    }
  }

  // 选区极值限制
  const RA_LIMIT = 2 // deg
  const DEC_LIMIT = 1 // deg
  const [selectionWarning, setSelectionWarning] = useState(false)

  const handleMouseUp = () => {
    if (isSelectionMode && selectionStart && mainImageRef.current) {
      // 选区结束后，发送后端请求、重置状态（选区坐标和预览已由 SelectionBox 实时更新）
      const payload = prepareRetrievePayload()
      setTestLog(payload)
      fetch('http://localhost:3001/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})

      // Trigger JSP image display
      setShowJspImage(true)

      setIsSelectionMode(false)
      setSelectionStart(null)
      setCurrentSelection(null)
    }
  }

  const handleSelectionButtonClick = () => {
    setIsSelectionMode(!isSelectionMode)
    if (!isSelectionMode) {
      // Reset selection when entering selection mode
      setSelectionStart(null)
      setCurrentSelection(null)
      setSelectionWarning(false)
    }
  }

  // 在 AstroImageViewer 组件内添加重置函数
  const handleResetTelescopesAndFilters = () => {
    setTelescopes([
      { key: 'twomass', label: '2MASS', selected: false },
      { key: 'desi', label: 'DESI', selected: false },
      { key: 'euclid', label: 'Euclid', selected: false },
      { key: 'wise', label: 'WISE', selected: false },
    ])
    setTwoMassFilters([
      { key: 'h', label: 'h', checked: false },
      { key: 'j', label: 'j', checked: false },
      { key: 'k', label: 'k', checked: false },
    ])
    setDesiFilters([
      { key: 'W1', label: 'W1', checked: false },
      { key: 'W2', label: 'W2', checked: false },
      { key: 'W3', label: 'W3', checked: false },
      { key: 'W4', label: 'W4', checked: false },
      { key: 'g', label: 'g', checked: false },
      { key: 'i', label: 'i', checked: false },
      { key: 'r', label: 'r', checked: false },
      { key: 'z', label: 'z', checked: false },
    ])
    setEuclidFilters([
      { key: 'DECAM_g', label: 'DECAM_g', checked: false },
      { key: 'DECAM_i', label: 'DECAM_i', checked: false },
      { key: 'DECAM_r', label: 'DECAM_r', checked: false },
      { key: 'DECAM_z', label: 'DECAM_z', checked: false },
      { key: 'HSC_g', label: 'HSC_g', checked: false },
      { key: 'HSC_z', label: 'HSC_z', checked: false },
      { key: 'MEGACAM_r', label: 'MEGACAM_r', checked: false },
      { key: 'MEGACAM_u', label: 'MEGACAM_u', checked: false },
      { key: 'NIR_H', label: 'NIR_H', checked: false },
      { key: 'NIR_J', label: 'NIR_J', checked: false },
      { key: 'NIR_Y', label: 'NIR_Y', checked: false },
      { key: 'PANSTARRS_i', label: 'PANSTARRS_i', checked: false },
    ])
    setWiseFilters([
      { key: '1', label: '1', checked: false },
      { key: '2', label: '2', checked: false },
      { key: '3', label: '3', checked: false },
      { key: '4', label: '4', checked: false },
    ])
  }

  return (
    <div className={style.astroViewer}>
      <Title level={2} className={style.title}>
        Astronomical Image Viewer
      </Title>
      <div className={style.mainLayout}>
        {/* Left Sidebar */}
        <div className={style.leftSider}>
          <Card
            title="Telescopes & Filters"
            className={style.telescopeCard}
          >
            {/* 重置按钮放在标题下方、选项上方 */}
            <Button
              size="small"
              style={{ margin: '8px 0 12px 0' }}
              onClick={handleResetTelescopesAndFilters}
              block
            >
              重置
            </Button>
            <div className={style.telescopeSection}>
              {/* 2MASS Telescope */}
              <div className={style.telescopeItem}>
                <div className={style.telescopeHeader}>
                  <Checkbox
                    checked={
                      telescopes.find((t) => t.key === 'twomass')?.selected
                    }
                    onChange={(e) =>
                      handleTelescopeChange('twomass', e.target.checked)
                    }
                  >
                    <Text strong>2MASS</Text>
                  </Checkbox>
                </div>
                {telescopes.find((t) => t.key === 'twomass')?.selected && (
                  <div className={style.filterGroup}>
                    {twoMassFilters.map((filter) => (
                      <Checkbox
                        key={filter.key}
                        checked={filter.checked}
                        onChange={(e) =>
                          handleFilterChange(
                            'twomass',
                            filter.key,
                            e.target.checked,
                          )
                        }
                      >
                        {filter.label}
                      </Checkbox>
                    ))}
                  </div>
                )}
              </div>
              {/* DESI Telescope */}
              <div className={style.telescopeItem}>
                <div className={style.telescopeHeader}>
                  <Checkbox
                    checked={telescopes.find((t) => t.key === 'desi')?.selected}
                    onChange={(e) =>
                      handleTelescopeChange('desi', e.target.checked)
                    }
                  >
                    <Text strong>DESI</Text>
                  </Checkbox>
                </div>
                {telescopes.find((t) => t.key === 'desi')?.selected && (
                  <div className={style.filterGroup}>
                    {desiFilters.map((filter) => (
                      <Checkbox
                        key={filter.key}
                        checked={filter.checked}
                        onChange={(e) =>
                          handleFilterChange(
                            'desi',
                            filter.key,
                            e.target.checked,
                          )
                        }
                      >
                        {filter.label}
                      </Checkbox>
                    ))}
                  </div>
                )}
              </div>
              {/* Euclid Telescope */}
              <div className={style.telescopeItem}>
                <div className={style.telescopeHeader}>
                  <Checkbox
                    checked={
                      telescopes.find((t) => t.key === 'euclid')?.selected
                    }
                    onChange={(e) =>
                      handleTelescopeChange('euclid', e.target.checked)
                    }
                  >
                    <Text strong>Euclid</Text>
                  </Checkbox>
                </div>
                {telescopes.find((t) => t.key === 'euclid')?.selected && (
                  <div className={style.filterGroup}>
                    {euclidFilters.map((filter) => (
                      <Checkbox
                        key={filter.key}
                        checked={filter.checked}
                        onChange={(e) =>
                          handleFilterChange(
                            'euclid',
                            filter.key,
                            e.target.checked,
                          )
                        }
                      >
                        {filter.label}
                      </Checkbox>
                    ))}
                  </div>
                )}
              </div>
              {/* WISE Telescope */}
              <div className={style.telescopeItem}>
                <div className={style.telescopeHeader}>
                  <Checkbox
                    checked={telescopes.find((t) => t.key === 'wise')?.selected}
                    onChange={(e) =>
                      handleTelescopeChange('wise', e.target.checked)
                    }
                  >
                    <Text strong>WISE</Text>
                  </Checkbox>
                </div>
                {telescopes.find((t) => t.key === 'wise')?.selected && (
                  <div className={style.filterGroup}>
                    {wiseFilters.map((filter) => (
                      <Checkbox
                        key={filter.key}
                        checked={filter.checked}
                        onChange={(e) =>
                          handleFilterChange(
                            'wise',
                            filter.key,
                            e.target.checked,
                          )
                        }
                      >
                        {filter.label}
                      </Checkbox>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        {/* Main Content Area */}
        <div className={style.mainContent}>
          <div className={style.imageContainer}>
            <div className={style.imageWrapper}>
              {/* 3D Celestial Sphere */}
              <div
                className={`${style.mainImage} ${isSelectionMode ? style.selectionMode : ''}`}
                ref={mainImageRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                style={{ cursor: isSelectionMode ? 'crosshair' : 'default' }}
              >
                <CelestialSphere
                  ref={celestialRef}
                  selectedTelescopes={telescopes
                    .filter((t) => t.selected)
                    .map((t) => t.key)}
                  onRaycast={handleRaycast}
                  showCoordinates={false} // 不再由 CelestialSphere 内部显示悬浮坐标
                />
                {/* 悬浮坐标框，单行自适应宽度，风格与 CelestialSphere 内部一致 */}
                {hoverRaDec && (
                  <div className={style.hoverRaDecBox}>
                    RA: <span className="ra">{hoverRaDec.ra.toFixed(3)}°</span> &nbsp;|&nbsp; Dec: <span className="dec">{hoverRaDec.dec.toFixed(3)}°</span>
                  </div>
                )}
                {/* ...existing code... */}
                {/* Selection rectangle overlay */}
                {isSelectionMode && selectionStart && currentSelection && mainImageRef.current && celestialRef.current && celestialRef.current.getCamera() && celestialRef.current.getSphere() && (
                  <SelectionBox
                    start={selectionStart}
                    end={currentSelection}
                    className={style.selectionRectangle}
                    containerRect={mainImageRef.current.getBoundingClientRect()}
                    getRaDecByRaycast={getRaDecByRaycast}
                    camera={celestialRef.current.getCamera()}
                    sphere={celestialRef.current.getSphere()}
                    raLimit={RA_LIMIT}
                    decLimit={DEC_LIMIT}
                    onChange={(corners, warning) => {
                      setPreviewData(
                        corners.map((c) => `RA: ${c.ra.toFixed(6)}°, Dec: ${c.dec.toFixed(6)}°`)
                      )
                      setLastSelectionCorners(corners) // 存储原始高精度数据
                      setSelectionWarning(warning)
                    }}
                  />
                )}
                {/* Selection mode overlay */}
                {isSelectionMode && (
                  <div className={style.selectionOverlay}>
                    <div className={style.selectionInstructions}>
                      框选区域以选取天区<br />
                      按住鼠标左键拖动，释放后即取回坐标及图像
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right Sidebar */}
        <div className={style.rightSider}>
          <Card title="Coordinations" className={style.coordinationCard}>
            <Button
              type="primary"
              size="small"
              onClick={handleSelectionButtonClick}
              className={style.selectionButton}
            >
              {isSelectionMode ? 'Cancel Selection' : 'Select'}
            </Button>
            <List
              size="small"
              dataSource={previewData}
              renderItem={(item, idx) => {
                let ra = '', dec = '';
                const match = item.match(/RA[:\s]*([\d.\-]+)[^\d]+Dec[:\s]*([\d.\-]+)/i);
                if (match) {
                  ra = match[1] ?? '';
                  dec = match[2] ?? '';
                }
                return (
                  <div key={idx}>
                    <div className={style.coordinationText}>RA: {ra}°</div>
                    <div className={style.coordinationText}>Dec: {dec}°</div>
                    {idx !== previewData.length - 1 && <hr style={{ margin: '6px 0', border: 0, borderTop: '1px solid #eee' }} />}
                  </div>
                );
              }}
            />
            {isSelectionMode && (
              <Alert
                message={
                  <>
                    选区最大范围：<br />
                    RA≤2°<br />
                    Dec≤1°<br />
                    超出将自动截断
                  </>
                }
                type="info"
                showIcon={false}
                className={style.alertInfo}
              />
            )}
            {selectionWarning && (
              <Alert
                message="已自动截断超出范围的选区"
                type="warning"
                showIcon
                className={style.alertWarning}
              />
            )}
          </Card>
        </div>
      </div>
      {/* JSP Images Gallery */}
      <Card title="JSP Images" className={style.imagesGallery} style={{ marginBottom: 16 }}>
        {showJspImage ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <img
              src={JSP_IMAGE_PATH}
              alt="JSP Dummy"
              style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, boxShadow: '0 2px 8px #eee', cursor: 'pointer' }}
              onClick={() => setJspModalVisible(true)}
            />
            <div style={{ marginTop: 8, color: '#888' }}>点击图片全屏显示</div>
          </div>
        ) : (
          <div style={{ color: '#aaa', textAlign: 'center', padding: '24px 0' }}>
            JSP images will be displayed here.
          </div>
        )}

      {/* Fullscreen JSP image modal */}
      {jspModalVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setJspModalVisible(false)}
        >
          <img
            src={JSP_IMAGE_PATH}
            alt="JSP Dummy Fullscreen"
            style={{
              maxWidth: '95vw',
              maxHeight: '95vh',
              borderRadius: 12,
              boxShadow: '0 4px 32px #222',
              background: '#111',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 24,
              right: 36,
              color: '#fff',
              fontSize: 32,
              fontWeight: 700,
              cursor: 'pointer',
              zIndex: 10000,
              textShadow: '0 2px 8px #000',
            }}
            onClick={() => setJspModalVisible(false)}
          >×</span>
        </div>
      )}
      </Card>

      {/* Bottom Retrieved Images Gallery */}
      <Card title="Retrieved Images" className={style.imagesGallery}>
        <Row gutter={[16, 16]} className={style.imageGrid}>
          {retrievedImages.map((image) => (
            <Col key={image.id} xs={12} sm={8} md={6} lg={4} xl={4}>
              <div className={style.thumbnailWrapper}>
                <div className={style.thumbnail}>
                  {/* Placeholder for image thumbnails */}
                  <div className={style.thumbnailPlaceholder}></div>
                </div>
              </div>
            </Col>
          ))}
          <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <Button
              type="default"
              icon={<EyeOutlined />}
              className={style.viewMetaButton}
            >
              View More
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 横向 Retrieved Data 卡片 */}
      <Card title="Retrieved Data" className={style.dataCard} style={{ margin: '16px 0' }}>
        <List
          size="small"
          dataSource={retrievedData}
          renderItem={(item) => (
            <List.Item className={style.dataItem}>{item.name}</List.Item>
          )}
        />
      </Card>

      {/* 测试窗口移到此处 */}
      <Card title="测试窗口（模拟server.cjs输出）" style={{ marginTop: 16 }}>
        <pre className={style.testWindowPre}>
          {testLog ? JSON.stringify(testLog, null, 2) : '暂无数据'}
        </pre>
      </Card>
    </div>
  )
}

export default AstroImageViewer
