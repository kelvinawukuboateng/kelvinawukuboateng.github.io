// Tech-stack balls. `mark` is the short label printed on each ball; `color` is its ink.
// Edit freely: add or remove entries and the cluster re-lays itself out.

export const STACK = [
  { name: 'Python', mark: 'Py', color: '#3776ab', group: 'Pipelines & platforms' },
  { name: 'SQL', mark: 'SQL', color: '#0f766e', group: 'Pipelines & platforms' },
  { name: 'PostgreSQL', mark: 'PG', color: '#336791', group: 'Pipelines & platforms' },
  { name: 'Kafka', mark: 'Kafka', color: '#1f2937', group: 'Pipelines & platforms' },
  { name: 'Docker', mark: 'Dkr', color: '#1d8ce0', group: 'Pipelines & platforms' },
  { name: 'Alembic', mark: 'Alm', color: '#6b7280', group: 'Pipelines & platforms' },
  { name: 'Git', mark: 'Git', color: '#e8512c', group: 'Pipelines & platforms' },
  { name: 'Pandas', mark: 'pd', color: '#150458', group: 'Analysis & ML' },
  { name: 'scikit-learn', mark: 'sk', color: '#e3830f', group: 'Analysis & ML' },
  { name: 'XGBoost', mark: 'XGB', color: '#1584be', group: 'Analysis & ML' },
  { name: 'TensorFlow', mark: 'TF', color: '#ef6c00', group: 'Analysis & ML' },
  { name: 'ArcGIS', mark: 'Arc', color: '#2c7ac3', group: 'Geospatial' },
  { name: 'QGIS', mark: 'Q', color: '#4b8b2f', group: 'Geospatial' },
  { name: 'MapLibre', mark: 'ML', color: '#295daa', group: 'Geospatial' },
  { name: 'Grafana', mark: 'Gf', color: '#e8590c', group: 'Dashboards & web' },
  { name: 'Streamlit', mark: 'St', color: '#e63946', group: 'Dashboards & web' },
  { name: 'Plotly', mark: 'Pl', color: '#3f4f75', group: 'Dashboards & web' },
  { name: 'React', mark: 'Re', color: '#0e8fb8', group: 'Dashboards & web' },
  { name: 'JavaScript', mark: 'JS', color: '#b89400', group: 'Dashboards & web' },
];

// Extra tools listed in text only.
export const EXTRA = {
  'Pipelines & platforms': ['REST APIs', 'CI/CD', 'Cloud IoT brokers'],
  'Analysis & ML': ['NLP', 'Time series', 'Matplotlib', 'Seaborn'],
  'Geospatial': ['Remote sensing', 'Leafmap', 'KML/KMZ', 'Google Earth'],
  'Dashboards & web': ['HTML/CSS', 'Express', 'FastAPI'],
};
