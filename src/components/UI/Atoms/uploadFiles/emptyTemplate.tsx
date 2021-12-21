// styles
import classes from 'styles/Families/import.module.scss'

export const emptyTemplate = () => (
  <div className={classes.emptyContainer}>
    <i className='pi pi-image' />
    <p>Drag and Drop JSON files Here</p>
  </div>
)
