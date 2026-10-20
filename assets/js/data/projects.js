// Project content and the chart data behind each preview screen.
// Chart numbers were aggregated from the datasets inside each GitHub repo.

const GH = 'https://github.com/iamjustkay/';

export const DATA = {
  food: {
    top: [['Beef (beef herd)', 59.6], ['Lamb & Mutton', 24.5], ['Cheese', 21.2], ['Beef (dairy herd)', 21.1],
          ['Dark Chocolate', 18.7], ['Coffee', 16.5], ['Shrimps (farmed)', 11.8], ['Palm Oil', 7.6]],
    stages: [['Farm', 3.47], ['Land use change', 1.26], ['Animal feed', 0.45], ['Packaging', 0.27],
             ['Processing', 0.25], ['Transport', 0.20], ['Retail', 0.07]],
  },
  freight: {
    years: [2020, 2021, 2022, 2023, 2024],
    // trade value, USD billions, by mode (BTS TransBorder)
    modes: {
      Truck: [2252.3, 3263.3, 3634.4, 3041.4, 1949.0],
      Rail: [480.9, 733.6, 818.8, 643.2, 387.1],
      Vessel: [244.4, 364.1, 523.5, 371.2, 222.9],
      Pipeline: [190.7, 368.7, 567.4, 353.4, 201.6],
      Air: [152.1, 203.4, 223.5, 174.0, 101.9],
      Other: [166.4, 241.9, 260.9, 214.8, 128.1],
    },
  },
  bank: { rate: [10.1, 16.6, 52.0, 19.7, 6.7, 10.2, 9.1, 11.0, 46.5, 43.8, 10.2, 46.7] },
  rec: {
    weekly: [106401, 118623, 121522, 112938, 115012, 105646, 112304, 110245, 109248, 129137,
             122696, 143160, 116232, 103969, 99425, 103944, 104070, 98503, 114386],
    funnel: [['view', 2194512], ['add to cart', 16353], ['transaction', 883]],
  },
};

export const PROJECTS = [
  {
    id: 'food', year: '2025', title: 'Food Production Impact', kicker: 'Sustainability analytics · Streamlit',
    accent: '#7fd99a', url: 'environmentimpactoffoodanalysis.streamlit.app', live: true,
    summary: 'An interactive dashboard on the environmental cost of 43 foods, built on Our World in Data figures for greenhouse gas emissions, land use, freshwater withdrawals and eutrophication.',
    points: [
      'Seven business questions answered with CRISP-DM, from top emitters to lifecycle-stage breakdowns.',
      'Cleaned the source (column typos, non-numeric fields) and rebuilt total emissions from lifecycle stages.',
      'Policy simulator: what a 50% cut to transport and packaging emissions would actually save.',
      'Finding: farm stage and land-use change dominate. Beef herd emits about 60 kgCO₂e per kg.',
    ],
    metrics: [['43', 'foods compared'], ['7', 'business questions'], ['59.6', 'kgCO₂e/kg, beef'], ['r ≈ 0.26', 'water vs. emissions']],
    stack: ['Python', 'Pandas', 'Plotly', 'Streamlit'],
    links: [['Open dashboard', 'https://environmentimpactoffoodanalysis.streamlit.app/'],
            ['Source on GitHub', GH + 'Environment_Impact_of_Food_Production_Analysis']],
    draw: 'food',
  },
  {
    id: 'freight', year: '2025', title: 'TransBorder Freight', kicker: 'Logistics analytics · BTS data',
    accent: '#5cc8ff', url: '7jagte9f28epon3fshwikq.streamlit.app', live: true,
    summary: 'Five years of U.S. Bureau of Transportation Statistics cross-border freight data (U.S. with Canada and Mexico), analysed for mode efficiency, regional flows and the effect of economic shocks.',
    points: [
      'Merged and cleaned 5.2M monthly records from 2020 to 2024.',
      'Compared value, weight and freight charges across truck, rail, vessel, pipeline and air.',
      'Identified underused rail capacity and the cost-per-ton-km advantage of rail and sea.',
      'Recommendations on modal shift, route planning and CO₂ tracking per shipment.',
    ],
    metrics: [['5.2M', 'rows analysed'], ['5', 'years, 2020–24'], ['~65%', 'trade value by truck'], ['7', 'business questions']],
    stack: ['Python', 'Pandas', 'Seaborn', 'Streamlit', 'Jupyter'],
    links: [['Open dashboard', 'https://7jagte9f28epon3fshwikq.streamlit.app/'],
            ['Source on GitHub', GH + '-TransBorder-Freight-Data-Analysis-Project']],
    draw: 'freight',
  },
  {
    id: 'bank', year: '2025', title: 'Client Subscription Predictor', kicker: 'Machine learning · Bank marketing',
    accent: '#f5b841', url: 'market-campaign-subscription-predictor.streamlit.app', live: true,
    summary: 'Predicts which bank clients will subscribe to a term deposit, so marketing teams can call the right people. Deployed as a Streamlit front end over a FastAPI model service.',
    points: [
      'Pipeline over 45,211 records and 17 features: Min-Max scaling, one-hot encoding, ordinal months and an engineered contacted_before flag.',
      'Rebalanced classes with ADASYN, raising the minority class from 12% to 45%.',
      'Benchmarked Random Forest, XGBoost, Logistic Regression and Decision Tree.',
      'Random Forest reached 89.45% accuracy and 93.05% ROC-AUC; XGBoost lifted recall by 17%.',
    ],
    metrics: [['93.05%', 'ROC-AUC'], ['89.45%', 'accuracy'], ['+17%', 'recall, XGBoost'], ['45,211', 'records']],
    stack: ['scikit-learn', 'XGBoost', 'imbalanced-learn', 'FastAPI', 'Streamlit', 'Render'],
    links: [['Open web app', 'https://market-campaign-subscription-predictor-5sf7jpapwrnegk8uvtgf4f.streamlit.app'],
            ['Source on GitHub', GH + 'Market-Campaign-Subscription-Predictor']],
    draw: 'bank',
  },
  {
    id: 'rec', year: '2025', title: 'Recommender & Anomaly Detection', kicker: 'Deep learning · E-commerce',
    accent: '#c59bff', url: 'github.com/iamjustkay/Recommendation_System',
    summary: 'A CNN recommendation model and a CNN autoencoder that flags abnormal users, trained on a retail event log of views, add-to-carts and transactions.',
    points: [
      'ETL across 4.8M+ records spanning events, category tree and item properties.',
      'Cleaning, anomaly filtering and feature engineering to prepare data for modelling at scale.',
      'CNN recommender at 65%+ accuracy; the autoencoder flagged 2% of users as abnormal.',
      'Streamlit view of seasonal trends, user behaviour and anomaly results.',
    ],
    metrics: [['4.8M+', 'records processed'], ['65%+', 'recommender accuracy'], ['2%', 'users flagged'], ['2.2M', 'events']],
    stack: ['Python', 'TensorFlow', 'Keras', 'Pandas', 'Streamlit'],
    links: [['Source on GitHub', GH + 'Recommendation_System']],
    draw: 'rec',
  },
  {
    id: 'water', year: '2024', title: 'Coastal Water Quality', kicker: 'MSc research · Environmental ML',
    accent: '#4fd1c5', url: 'MSc research · University of Ghana',
    summary: 'MSc research at the University of Ghana on classifying and forecasting coastal water quality, to support marine ecosystem management.',
    points: [
      'Time-series ETL: outlier removal, stationarity testing and correlation-based feature selection.',
      'Supervised and unsupervised approaches that raised predictive accuracy by 18%.',
      'Benchmarked ANN, SVM and Random Forest on F1 and regression metrics.',
      'Recommendations aimed at policy-driven water quality interventions.',
    ],
    metrics: [['+18%', 'predictive accuracy'], ['3', 'model families'], ['2023–24', 'research period'], ['MSc', 'Computer Science']],
    stack: ['Python', 'scikit-learn', 'Keras', 'statsmodels'],
    links: [],
    draw: 'water',
  },
  {
    id: 'gis', year: '2024', title: 'Web Mapping with MapLibre', kicker: 'Geospatial · Notebook',
    accent: '#ff8a65', url: 'github.com/iamjustkay/GIS',
    summary: 'Interactive vector maps in Python with Leafmap and MapLibre GL: basemap styles, 3D pitch and bearing, and layer control. The same craft behind 1,500+ census maps at Ghana Statistical Service.',
    points: [
      'Leafmap and MapLibre maps with custom styles, pitch and bearing.',
      'Vector layers and basemap switching inside Jupyter.',
      'Builds on four years of ArcGIS and QGIS production mapping.',
    ],
    metrics: [['1,500+', 'census maps (GSS)'], ['60%', 'fewer processing errors']],
    stack: ['Leafmap', 'MapLibre GL', 'Python', 'ArcGIS', 'QGIS'],
    links: [['Source on GitHub', GH + 'GIS']],
    draw: 'gis',
  },
  {
    id: 'lab', year: '2024', title: 'Vision & Bioinformatics Lab', kicker: 'Notebooks · Image and sequence',
    accent: '#f472b6', url: 'github.com/iamjustkay/Computer_Vision',
    summary: 'Two study notebooks: image filtering and noise removal with scikit-image, and sequence work in Biopython on a protein structure from the RCSB PDB.',
    points: [
      'Added synthetic noise to images and compared smoothing filters side by side.',
      'Transcribed and translated DNA sequences with Biopython.',
      'Parsed FASTA from PDB entry 8X1D.',
    ],
    metrics: [['2', 'notebooks'], ['8X1D', 'PDB entry']],
    stack: ['scikit-image', 'NumPy', 'Matplotlib', 'Biopython'],
    links: [['Computer Vision repo', GH + 'Computer_Vision'], ['Bioinformatics repo', GH + 'Bioinformatics']],
    draw: 'lab',
  },
  {
    id: 'web', year: '2022', title: 'Early Web Builds', kicker: 'Full-stack foundations',
    accent: '#93c5fd', url: 'github.com/iamjustkay/Web-App',
    summary: 'Where I started: a ticket booking app with React, Express and MySQL, an HTML quiz app, an admin dashboard, and a payment claim form for the Ghana School Feeding Programme.',
    points: [
      'Ticket booking: React client, Express API, MySQL storage.',
      'Quiz app with shuffled questions in vanilla JavaScript.',
      'Responsive admin dashboard and government payment-form layouts.',
    ],
    metrics: [['4', 'projects'], ['2022', 'year']],
    stack: ['React', 'Express', 'MySQL', 'JavaScript', 'HTML/CSS'],
    links: [['Ticket app', GH + 'Web-App'], ['Quiz app', GH + 'Quiz-App'],
            ['Admin dashboard', GH + 'Admin-Dashboard'], ['Payment form', GH + 'Payment-Claim-Forms']],
    draw: 'web',
  },
];
