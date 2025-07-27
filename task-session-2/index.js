
async function searchMeals() {
    const ingredient = document.getElementById('ingredientInput').value.trim();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "";

    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredient}`);
        const data = await res.json();
        if (!data.meals) {
            resultsContainer.innerHTML = "<p>No meals found.</p>";
            return;
        }

        data.meals.forEach(meal => {
            const card = document.createElement('a');
            card.className = 'card';
            card.href = `https://www.themealdb.com/meal/${meal.idMeal}`;
            card.target = "_blank";
            card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p>Meal Ingredients: ${meal.strIngredient1 ? meal.strIngredient1 + ', ' : ''}${meal.strIngredient2 ? meal.strIngredient2 + ', ' : ''}${meal.strIngredient3 ? meal.strIngredient3 : ''}</p>
            <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank">View Recipe</a>
          `;
            resultsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching meals:", error);
        resultsContainer.innerHTML = "<p>Error loading data.</p>";
    }
}

document.getElementById('searchButton').addEventListener('click', searchMeals);
