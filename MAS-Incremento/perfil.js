// Carregar dados do perfil ao abrir a página
function loadProfileData() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Usuário atual carregado:", currentUser); // Debug para verificar

    if (currentUser && currentUser.email) {
      document.getElementById("profileName").value = currentUser.name || "";
      document.getElementById("profileEmail").value = currentUser.email || "";
      document.getElementById("profilePassword").value = currentUser.password || "";
      document.getElementById("profilePhone").value = currentUser.phone || "";
      
      // Exibir imagem do perfil
      if (currentUser.image) {
        document.getElementById("profileImage").src = currentUser.image;
        document.getElementById("profileImage").style.display = "block";
      }
    } else {
      alert("Nenhum usuário logado. Redirecionando para a tela de login.");
      window.location.href = "index.html";
    }
}

// Carregar a imagem e exibi-la
const imageInput = document.getElementById("profileImageInput");
if (imageInput) {
  imageInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
    
        reader.onload = function (e) {
          document.getElementById("profileImage").src = e.target.result;
          document.getElementById("profileImage").style.display = "block";
    
          // Atualizar o objeto do usuário com a imagem em Base64
          const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
          currentUser.image = e.target.result;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        };
    
        reader.readAsDataURL(file);
      }
  });
}

// Atualizar dados do telefone e salvar no Gist
async function updateProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const phone = document.getElementById("profilePhone").value.trim();
  
    if (currentUser && currentUser.email) {
      currentUser.phone = phone; // Atualiza o telefone
      registeredUsers[currentUser.email] = currentUser;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
      // Salvar no Gist
      await saveAccounts();
      alert("Dados atualizados com sucesso!");
    } else {
      alert("Erro: Nenhum usuário logado.");
    }
}

// Encerrar sessão
function logout() {
    console.log("Encerrando sessão..."); // Debug
    localStorage.removeItem("currentUser"); // Remove o usuário do localStorage
    window.location.href = "index.html";
}

// Salvar os dados no Gist
async function saveAccounts() {
    const TOKEN = "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"; // Substitua pelo token GitHub
    const GIST_ID = "1f9af962c07e976b19797b5cd4161293"; // Substitua pelo ID do Gist
    const GIST_URL = `https://api.github.com/gists/${GIST_ID}`;
  
    const updatedContent = JSON.stringify(registeredUsers, null, 2);
    try {
      const response = await fetch(GIST_URL, {
        method: "PATCH",
        headers: {
          Authorization: `token ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            "data.json": { content: updatedContent },
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao salvar dados: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao salvar no Gist:", error);
      alert("Erro ao salvar os dados. Verifique sua conexão ou permissões.");
    }
}

// Variável global para armazenar os usuários
let registeredUsers = {};

// Carregar os usuários ao iniciar a página
(async function loadAccounts() {
    const TOKEN = "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"; // Substitua pelo token GitHub
    const GIST_ID = "1f9af962c07e976b19797b5cd4161293"; // Substitua pelo ID do Gist
    const GIST_URL = `https://api.github.com/gists/${GIST_ID}`;
  
    try {
      const response = await fetch(GIST_URL, {
        headers: { Authorization: `token ${TOKEN}` },
      });
      const gistData = await response.json();
      registeredUsers = JSON.parse(gistData.files['data.json'].content);
      console.log("Usuários carregados do Gist:", registeredUsers); // Debug

      // Atualiza localStorage com os dados do Gist
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser && registeredUsers[currentUser.email]) {
        localStorage.setItem("currentUser", JSON.stringify(registeredUsers[currentUser.email]));
      }
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      registeredUsers = {};
    }
})();
