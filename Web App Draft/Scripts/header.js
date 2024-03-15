function displayHeader() {
  const header = document.querySelector("header");
  if (header) {
    header.innerHTML = `
            <a href="/index.html">
                <img class="logo" src="/Images/Lambeth-logo-white.png" alt="Lambeth Council logo"/>
            </a>
            <h1>Lambeth Data Packs 2024</h1>
            <a href=""><button>Ambition Menu <i class="fa fa-chevron-down"></i></button></a>
        `;
  }
}
