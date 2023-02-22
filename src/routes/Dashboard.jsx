import { useEffect, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import RepoCard from "../components/RepoCard"

export default function Dashboard() {
  let [repos, setRepos] = useState([])
  let [loaded, setLoaded] = useState(false)

  const { user, username } = useAuthContext()
  
  useEffect(() => {
    const fetchRepo = () => {
      fetch(`/api/${username}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setRepos([...data.repos])
      })
    }

    if (user && user.user) {
      fetchRepo()
    }
  }, [user])


  return (
    <main>
      <section>
        <h1>{user && user.user? user.user.username + `'s` : ''} Recipes</h1>
      </section>
      <section>
      {repos.map(repo => <RepoCard repo={repo} key={repo.key} />)}
      </section>
    </main>
  )
}