import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={faSpinner} className={`animate-spin ${className}`} />
)

export default Spinner
