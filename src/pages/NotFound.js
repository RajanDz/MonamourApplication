import { useNavigate } from 'react-router-dom'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="not-found-page">
        <div>
          <div className="not-found-number">404</div>
          <h2>Page Not Found</h2>
          <p>The page you are looking for seems to have wandered off.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    </>
  )
}
