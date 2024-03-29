import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import RepoCard from "../components/RepoCard";

export default function Index() {
  let [repos, setRepos] = useState([]);
  let [loaded, setLoaded] = useState(false);
  let [page, setPage] = useState(null);
  let [limit, setLimit] = useState(null);

  const { user, username } = useAuthContext();

  useEffect(() => {
    let url = `/api/`;
    if (page) {
      url = `/api/?page=${page}&limit=${limit}`;
    }
    const fetchRepo = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setRepos(data.repos);
      setPage(data.page);
      setLimit(data.limit);
    };

    fetchRepo();
  }, [page]);

  return (
    <main className="bg-secondary text-secondary mx-auto pt-12 px-4 lg:px-8 pb-20">
      <section className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-center lg:text-left">
          All Recipes
        </h1>
        {user && user.user && (
          <NavLink
            to={`/${user.user.username}/create`}
            className="bg-tertiary text-tertiary rounded px-5 py-2 shadow shadow-gray-500"
          >
            New Recipe
          </NavLink>
        )}
      </section>
      <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:grid-flow-row lg:grid-cols-3">
        {repos.length > 0 ? (
          repos.map((repo) => <RepoCard repo={repo} key={repo.id} />)
        ) : (
          <p>
            There's nothing left to find.{" "}
            <NavLink to="/" onClick={() => setPage(1)}>
              Return home
            </NavLink>
          </p>
        )}
      </section>
      {
        <section className="mt-8 flex justify-between w-full">
          <NavLink
            to={`/?page=${Math.max(page - 1, 1)}&limit=${limit}`}
            onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}
            className="bg-tertiary text-tertiary rounded px-5 py-2 shadow shadow-gray-500"
          >
            Prev
          </NavLink>
          <NavLink
            to={`/?page=${page + 1}&limit=${limit}`}
            onClick={() => setPage((oldPage) => oldPage + 1)}
            className="ml-auto justify-self-end bg-tertiary text-tertiary rounded px-5 py-2 shadow shadow-gray-500"
          >
            Next
          </NavLink>
        </section>
      }
    </main>
  );
}
