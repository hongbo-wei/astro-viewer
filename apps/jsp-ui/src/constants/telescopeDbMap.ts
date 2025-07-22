// Telescope filter/band and database mapping
// Add or update as needed

export const TELESCOPE_FILTER_DB_MAP = {
  '2MASS': {
    column: 'filter',
    db: 'twomass_allsky_images',
  },
  DESI: {
    column: 'band',
    db: 'survey_bricks_dr10_south_external',
  },
  Euclid: {
    column: 'filter_name',
    db: 'sedm_mosaic_product',
  },
  WISE: {
    column: 'band',
    db: 'wise_wise_allwise_p3am_cdd',
  },
}
