async function fetchData() {
  try {
    const requestOptions = {
      method: "GET",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch("http://localhost:3000/data");
    const data = await response.json();

    const tableBody = document.querySelector("#playerTable");
    tableBody.innerHTML = "";

    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${item["_id"]}</td>
                <td>${item["Nume"]}</td>
                <td>${item["Echipa actuală"]}</td>
                <td>${item["Valoarea de piață"]} Euro</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Eroare:", error);
  }
}

fetchData();

const form = document.getElementById("add-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const response = await fetch("http://localhost:3000/data", requestOptions);
    const responseData = await response.json();

    console.log(responseData);
    fetchData();
  } catch (error) {
    console.error("Eroare:", error);
  }
});

// modifica un jucator
const formUpdate = document.getElementById("modify-form");

formUpdate.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      "http://localhost:3000/data/"+data.id ,
      requestOptions
    );
    const responseData = await response.json();

    console.log(responseData);
    fetchData();
  } catch (error) {
    console.error("Eroare:", error);
  }
});
