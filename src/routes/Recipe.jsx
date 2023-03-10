import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams, useNavigate } from "react-router-dom";
import EditRecipe from "./EditRecipe";

export default function Recipe() {
  const { userId, recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [image, setImage] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [editing, setEditing] = useState(false);

  const { user, username } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`/api/${userId}/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      updateRecipe(data.repo);
    };

    if (user && user.user) {
      fetchRecipe();
    }
  }, [user]);

  const initiateFork = async (e) => {
    const res = await fetch(`/api/${userId}/${recipeId}/fork`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      navigate(`/${username}/${data.repoId}`);
    }
  };

  const updateRecipe = (data) => {
    setEditing(false);
    setRecipe({ ...data });
    setImage(
      data.image ? [data.image.slice(0, 49), data.image.slice(62)] : null
    );
  };

  const handleDelete = async (e) => {
    setConfirm(false);
    const res = await fetch(`/api/${username}/${recipeId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (res.ok) navigate(`/${username}`);
  };

  return (
    <>
      {username && userId == user.user.username && !confirm ? (
        <button onClick={() => setConfirm(true)} className="btn">
          Delete
        </button>
      ) : (
        username &&
        userId == user.user.username && (
          <span>
            Are you sure?{" "}
            <button onClick={handleDelete} style={{ cursor: "pointer" }}>
              yes{" "}
            </button>
            <button
              onClick={() => setConfirm(false)}
              style={{ cursor: "pointer" }}
            >
              no{" "}
            </button>
          </span>
        )
      )}
      {user && user.user && username == userId && (
        <button
          onClick={() => setEditing((oldEditing) => !oldEditing)}
          className="btn"
        >
          {!editing ? `Edit Recipe` : `Discard Changes`}
        </button>
      )}
      {user && user.user && username != userId && (
        <button onClick={initiateFork} className="btn">
          Fork
        </button>
      )}

      {recipe && !editing && (
        <main>
          <section>
            {recipe && <h1>{recipe.title}</h1>}
            {image && (
              <img
                className=""
                sizes="(min-width: 30em) 50em, 28em, 100vw"
                srcSet={`${image[0]}/f_auto,q_70,w_256/${image[1]} 256w,
    	        ${image[0]}/f_auto,q_70,w_512/${image[1]} 512w,
    	        ${image[0]}/f_auto,q_70,w_768/${image[1]} 768w,
    	        ${image[0]}/f_auto,q_70,w_1024/${image[1]} 1024w,
    	        ${image[0]}/f_auto,q_70,w_1280/${image[1]} 1280w`}
                src={`${image[0]}/f_auto,q_70,w_512/${image[1]}`}
                alt={`User provided image of ${recipe.title}`}
              />
            )}
          </section>
          <section>
            {recipe.description.length && (
              <>
                <h2>Description</h2>
                <p>{recipe.description}</p>
              </>
            )}
            {recipe.versions[recipe.latest || 0].notes.length && (
              <>
                <h2>Notes</h2>
                <p>{recipe.versions[recipe.latest || 0].notes}</p>
              </>
            )}
          </section>
          <section>
            <h2>Ingredients</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  recipe.versions[recipe.latest || 0].ingredients
                ),
              }}
            ></div>
          </section>
          <section>
            <h2>Instructions</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  recipe.versions[recipe.latest || 0].instructions
                ),
              }}
            ></div>
          </section>
        </main>
      )}
      {recipe && editing && (
        <EditRecipe recipeData={recipe} updateRecipe={updateRecipe} />
      )}
    </>
  );
}
