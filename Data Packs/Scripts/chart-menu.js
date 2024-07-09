let currentCategoryIndex = 0;

// Function to generate menu items for a specific category
function generateMenuItemsForCategory(visualChartData, categoryData, index) {
  const menuContainer = document.getElementById("menuItems");
  menuContainer.innerHTML = ""; // Clear previous menu items

  const category = categoryData[index];
  const menuContentDiv = document.createElement("div");
  menuContentDiv.classList.add("menu-content");

  const categoryHeader = document.createElement("h2");
  categoryHeader.textContent = category ? category["Category-Name"] : ""; // Check if category exists
  menuContentDiv.appendChild(categoryHeader);

  // Filter visualChartData to include only charts where Chart-Displayed is 'y'
  const categoryCharts = category
    ? visualChartData.filter(
        (chart) =>
          chart["Category-ID"] === category["Category-ID"] &&
          chart["Chart-Displayed"] === "y"
      )
    : [];

  const chartList = document.createElement("ul");
  categoryCharts.forEach((chart) => {
    const chartItem = document.createElement("li");
    const chartLink = document.createElement("a");
    const chartButton = document.createElement("button");

    chartButton.textContent = chart["Visual-Chart-Name"];
    chartButton.onclick = () => {
      // Add onclick behavior if needed
    };
    chartLink.href = `charts.html?chart=${encodeURIComponent(
      chart["Visual-Chart-Name"]
    )}`; // Ensure URL encoding for chart names

    const checkIcon = document.createElement("i");
    chartLink.appendChild(checkIcon);

    chartLink.appendChild(chartButton); // Appending button tag inside anchor tag
    chartItem.appendChild(chartLink); // Appending anchor tag inside list item
    chartList.appendChild(chartItem);
  });

  menuContentDiv.appendChild(chartList); // Append the <ul> to the menu content div
  menuContainer.appendChild(menuContentDiv); // Append the menu content div to the container

  // Log page details after generating menu items
  logPageDetails();
}

// Function to navigate to the previous category
function showPreviousMenu() {
  const categoryDataLength = categoryData.length;
  currentCategoryIndex =
    (currentCategoryIndex - 1 + categoryDataLength) % categoryDataLength;
  generateMenuItemsForCategory(
    visualChartData,
    categoryData,
    currentCategoryIndex
  );
}

// Function to navigate to the next category
function showNextMenu() {
  const categoryDataLength = categoryData.length;
  currentCategoryIndex = (currentCategoryIndex + 1) % categoryDataLength;
  generateMenuItemsForCategory(
    visualChartData,
    categoryData,
    currentCategoryIndex
  );
}
