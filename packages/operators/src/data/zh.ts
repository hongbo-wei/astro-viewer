import { Data } from '../type'
const operatorData: Data = [
  {
    title: '模型',
    children: [
      {
        title: 'DRAFTS (Blinkverse)',
        author: ['国台（张永坤）'],
        tag: ['快速射电暴', '深度学习', '计算方法'],
        id: 'model1',
        link: 'https://github.com/SukiYume/DRAFTS',
        desc: `
        传统的单脉冲搜索技术（例如 Presto 和 Hemidall）面临一系列挑战，包括安装程序复杂、执行缓慢、结果不完整以及依赖人工结果验证。
        我们设计了基于深度学习的射电快速暂现源搜索流水线 (DRAFTS) 来解决上述问题。该流水线包含：a. CUDA 加速去色散，b. 物体检测模型提取 FRB 信号的 TOA 和 DM，c. 二元分类模型检查候选信号的真实性。
        `,
      },
      {
        title: 'PrestoZL (Blinkverse)',
        author: ['毛旷'],
        tag: ['脉冲星搜索', 'PRESTO GPU', 'Jerk Search'],
        id: 'model2',
        link: 'https://github.com/zhejianglab/PrestoZL',
        desc: `
        PrestoZL 是一款高度优化的、基于GPU的脉冲星搜索和分析软件。它基于 Scott Ransom 的 PRESTO 进行开发。两者之间的主要区别在于最耗时的“Jerk Search”模块的GPU优化，该模块通过GPU优化了并行处理流水线。PrestoZL 的搜索速度可以比 PRESTO 快几十倍，同时保持与 PRESTO 的 Jerk Search 完全一致的搜索逻辑和信号恢复能力。
        `,
      },
      {
        title: 'WestLake (Chemiverse)',
        author: ['邱逸盛'],
        tag: ['化学演化', '星际分子', '速率方程法'],
        id: 'model3',
        link: 'https://github.com/yqiuu/westlake',
        desc: `
        Westlake 是一款研究星际分子化学演化的工具。该代码采用速率方程法，使用一组耦合的常微分方程描述化学演化。由于化学系统的刚性，采用后向差分法来求解方程。实现了两相和三相模型。Westlake 用 Python 编写，易于使用，便于轻松整合新的反应机制。
        `,
      },
      {
        title: '3D-PDR (Chemiverse)',
        author: ['Bisbas', 'Thomas'],
        tag: ['天体化学', '星际分子'],
        id: 'model4',
        link: 'https://github.com/uclchem/3D-PDR',
        desc: `
        3D-PDR 是一种 3D 数值模拟代码，可以对任意密度分布的光致离解区（PDR）结构进行化学模拟。该代码在给定的三维云中求解化学和热平衡。它采用逃逸概率法计算给定 PDR 中任意一点的总加热和冷却函数。它使用基于 HEALPIx 的光线追踪方案来计算 PDR 中远紫外辐射的衰减以及远红外/亚毫米线发射从 PDR 中传播的情况。
        `,
      },
      {
        title: 'PDFchem v3.0 (Chemiverse)',
        author: ['蒋雪健'],
        tag: ['天体化学', '星际分子'],
        id: 'model5',
        link: 'https://github.com/Jiangxuejian/PDFchem',
        desc: `
        PDFchem 是一种创新的快速算法，它可以使用天文观测数据中的视线方向消光分布 (Av-PDF) 和大量预运行的热化学模拟来模拟冷气体的 ISM 化学，并且可以快速估算整个柱密度分布区域中的平均丰度和冷却谱线强度。与复杂的三维流体化学模拟相比，PDFchem 的并行计算能力能快速为一系列 ISM 环境参数组合提供 PDR 环境性质提供统计估计。
        `,
      },
      {
        title: '射电复合线模型',
        author: ['朱逢尧'],
        tag: ['射电天文领域', 'python'],
        id: 'model6',
        link: 'https://chemiverse.zero2x.org/models?model=HRRL',
        desc: `
        在Zhu et al. 2022 给出的先前模型的基础上，提出了改进的模型，以准确估计球对称H II 区域的偏离系数的空间分布。在改进模型中加入了对非局部计算的RRL和连续辐射影响的考虑。基于改进模型计算的大样本结果，使用随机森林回归建立了一个快速模型。
        `,
      },
    ],
  },
  {
    title: '数据集',
    children: [
      {
        title: '天文代码测评集',
        author: ['王雨涵'],
        tag: ['自然语言处理', '代码生成', '天文领域Python包', 'Python'],
        id: 'dataset1',
        link: 'https://github.com/WYHA/AstroCodeEval',
        desc: `
        天文代码生成评估数据集是一个专门构建的集合，包含542个编程问题，旨在评估代码生成模型在天文学领域的表现。每个数据项均包含一个自然语言指令（提示）、一个典型的解决方案（预期代码输出），以及一个用于验证生成代码的测试代码。
        `,
      },
    ],
  },
  {
    title: '软件包',
    children: [
      {
        title: 'GalSim CUDA加速',
        author: ['魏乃科'],
        tag: ['GalSim 光子射击渲染', 'CUDA加速'],
        id: 'package1',
        link: 'https://github.com/weinaike/GalSim_PhotonShoot_CUDA',
        desc: `
        本项目是GalSim 库的光子射击渲染方法的 CUDA 加速版本。
        `,
      },
    ],
  },
]

export default operatorData
