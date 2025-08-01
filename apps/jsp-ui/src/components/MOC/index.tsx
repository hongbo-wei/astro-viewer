import React, { useEffect, useState } from 'react';

export interface MOCData {
  name: string;
  data: any; // 如有需要可定义更具体的类型
}

interface MOCsProps {
  mocDir?: string; // 加载 MOC JSON 的目录，默认为 'moc_json'
  onMOCsLoaded: (mocs: MOCData[]) => void;
}

const MOCs: React.FC<MOCsProps> = ({ mocDir = 'moc_json', onMOCsLoaded }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 先加载 manifest 文件，获取所有 MOC JSON 文件名
    fetch(`/${mocDir}/moc_manifest.json`)
      .then((res) => {
        if (!res.ok) throw new Error('无法加载 MOC manifest 文件');
        return res.json();
      })
      .then((mocFiles: string[]) => {
        if (!Array.isArray(mocFiles) || mocFiles.length === 0) {
          throw new Error('MOC manifest 文件为空或格式不正确');
        }
        return Promise.all(
          mocFiles.map(async (filename) => {
            const res = await fetch(`/${mocDir}/${filename}`);
            if (!res.ok) throw new Error(`加载失败: ${filename}`);
            const data = await res.json();
            return { name: filename, data };
          })
        );
      })
      .then((mocs) => {
        onMOCsLoaded(mocs);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [mocDir, onMOCsLoaded]);

  if (loading) return <div>Loading MOCs...</div>;
  if (error) return <div>Error loading MOCs: {error}</div>;
  return null; // 此组件只负责加载并传递数据
};

export default MOCs;
