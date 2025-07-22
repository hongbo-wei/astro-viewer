import { Data } from '../type'
const operatorData: Data = [
  {
    title: 'Models',
    children: [
      {
        title: 'DRAFTS (Blinkverse)',
        author: ['Zhang Yongkun'],
        tag: ['Fast Radio Bursts', 'Deep Learning', 'Computational Methods'],
        id: 'model1',
        link: 'https://github.com/SukiYume/DRAFTS',
        desc: `
        Traditional single-pulse search techniques, such as Presto and Hemidall, suffer a series of challenges, including intricate installation procedures, sluggish execution, incomplete outcomes, and a reliance on human result verification.
We devised a Deep learning-based RAdio Fast Transient Search pipeline (DRAFTS) to address the aforementioned concerns. This pipeline contains: a. CUDA accelerated de-dispersion, b. Object detection model extracts TOA and DM of FRB signal, c. The binary classification model checks the authenticity of the candidate signal. 
        `,
      },
      {
        title: 'GPU version of PRESTO Jerk Search',
        author: ['Mao Kuang'],
        tag: ['Pulsar search', 'PRESTO GPU', 'Jerk Search'],
        id: 'model2',
        link: 'https://github.com/zhejianglab/PrestoZL',
        desc: `
        PrestoZL is a highly optimized, GPU-based pulsar search and analysis software developed by the team at the Astronomical Computing Research Center of Zhejiang Lab. It builds upon Scott Ransom's PRESTO. The key difference between them lies in the GPU optimization of the most time-consuming "Jerk Search" module, which has been tailored for GPU parallel processing pipelines. The search speed of PrestoZL can be accelerated by several tens of times faster than PRESTO, while maintaining the search logical and signal recovery capability fully consistent with PRESTO's Jerk Search.
        `,
      },
      {
        title: 'WestLake (Chemiverse)',
        author: ['Qiu Yisheng'],
        tag: [
          'Chemical Evolution',
          'Interstellar Molecule',
          'Rate Equation Method',
        ],
        id: 'model3',
        link: 'https://github.com/yqiuu/westlake',
        desc: `
        Westlake is a tool to study the chemical evolution of interstellar molecules. The code employs the rate equation method, describing the chemical evolution using a set of coupled ordinary differential equations. Due to the stiffness of the chemical system, the backward difference method is applied to solve the equations. Both two phase and three phase models are implemented. Written in Python, Westlake is user-friendly and facilitates the easy incorporation of new reaction mechanisms.
        `,
      },
      {
        title: '3D-PDR (Chemiverse)',
        author: ['Bisbas', 'Thomas'],
        tag: ['Astrochemistry', 'Interstellar Molecule'],
        id: 'model4',
        link: 'https://github.com/uclchem/3D-PDR',
        desc: `
        3D-PDR is a 3D numerical simulation code which can treat PDRs of arbitrary density distribution. The code solves the chemistry and the thermal balance self-consistently within a given three-dimensional cloud. It calculates the total heating and cooling functions at any point in a given PDR by adopting an escape probability method. It uses a HEALPIx-based ray tracing scheme to evaluate the attenuation of the far-ultraviolet radiation in the PDR and the propagation of the far-infrared/submm line emission out of the PDR.
        `,
      },
      {
        title: 'PDFchem v3.0 (Chemiverse)',
        author: ['Jiang Xuejian'],
        tag: ['Astrochemistry', 'Interstellar Molecule'],
        id: 'model5',
        link: 'https://github.com/Jiangxuejian/PDFchem',
        desc: `
        PDFchem is a novel algorithm that can model the ISM chemistry of the cold gas using distributions of observed visual extinctions (Av-PDF) and a large grid of pre-run thermochemical simulations, and can quickly estimate the average abundances and cooling line emissions for entire column-density distributions. In contrast to the complicated and heavy three-dimensional hydro-chemical simulations, PDFchem can instantly offer a statistical estimation of the PDR properties for many combinations of ISM environmental parameters.
        `,
      },
      {
        title: 'Hydrogen Radio Recombination Lines（Chemiverse）',
        author: ['Zhu Fengyao'],
        tag: ['Radio Astronomy', 'python'],
        id: 'model6',
        link: 'https://chemiverse.zero2x.org/models?model=HRRL',
        desc: `
        Based on the previous model given in Zhu et al. 2022, the improved model is developed to accurately estimate the spatial distributions of departure coefficients in spherically symmetric H II regions. The consideration of effects of RRLs and continuum emissions calculated non-locally is added to the improved model. Based on the large sample of results calculated using the improved model, a fast model is created using random forest regression.
        `,
      },
    ],
  },
  {
    title: 'Datasets',
    children: [
      {
        title: 'AstroCodeEval',
        author: ['Wang Yuhuan'],
        tag: [
          'Natural Language Processing',
          'Code Generation',
          'Python Packages for Astronomy',
          'Python',
        ],
        id: 'dataset1',
        link: 'https://github.com/WYHA/AstroCodeEval',
        desc: `
        The Astronomical Code Generation Evaluation Dataset is a specialized collection of 542 programming problems designed to evaluate code generation models within the field of astronomy. Each data in the dataset features a natural language instruction (prompt) paired with a canonical solution—an expected code output—and a test code to validate the generated code.
        `,
      },
    ],
  },
  {
    title: 'Packages',
    children: [
      {
        title: 'GalSim_PhotonShoot_CUDA',
        author: ['Wei Naike'],
        tag: ['GalSim PhotonShooting CUDA'],
        id: 'package1',
        link: 'https://github.com/weinaike/GalSim_PhotonShoot_CUDA',
        desc: `
        This project is a CUDA-accelerated version of the photon shooting rendering method from the GalSim library.
        `,
      },
    ],
  },
]

export default operatorData
