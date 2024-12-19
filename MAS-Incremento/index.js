const GIST_ID = "1f9af962c07e976b19797b5cd4161293"; // Substitua pelo ID do Gist
const TOKEN = "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"; // Substitua pelo seu Token GitHub
const GIST_URL = `https://api.github.com/gists/${GIST_ID}`;

let registeredUsers = {};

// Carregar contas do GitHub Gist
async function loadAccounts() {
  try {
    const response = await fetch(GIST_URL, {
      headers: { Authorization: `token ${TOKEN}` },
    });
    const gistData = await response.json();
    registeredUsers = JSON.parse(gistData.files['data.json'].content);
  } catch (error) {
    console.error("Erro ao carregar contas:", error);
    registeredUsers = {};
  }
}

// Salvar contas no GitHub Gist
async function saveAccounts() {
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
      throw new Error(`Erro ao salvar: ${response.statusText}`);
    }
    console.log("Dados salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    alert("Falha ao salvar os dados. Verifique o console para mais informações.");
  }
}


// Registro de usuário
async function validateRegisterForm(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = document.getElementById("name").value.trim();

  if (registeredUsers[email]) {
    alert("Email já registado!");
    return;
  }

  registeredUsers[email] = { password, name };
  await saveAccounts();
  alert("Conta criada com sucesso!");
  showLogin();
}

// Login de usuário
async function validateLoginForm(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  // Verificar se os dados estão corretos
  if (registeredUsers[email] && registeredUsers[email].password === password) {
    const currentUser = {
      email: email,
      name: registeredUsers[email].name,
      password: registeredUsers[email].password,
      phone: registeredUsers[email].phone || ""
    };

    // Salva os dados do usuário logado no localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert(`Bem-vindo, ${currentUser.name}!`);
    window.location.href = "perfil.html"; // Redireciona para a página de perfil
  } else {
    alert("Email ou senha incorretos!");
  }
}


// Voltar para a tela inicial
function goBackToHome() {
  document.getElementById('register-form').classList.add('d-none');
  document.getElementById('login-form').classList.add('d-none');
  document.getElementById('login-register-screen').classList.remove('d-none');
}

// Mostrar o login
function showLogin() {
  document.getElementById('login-register-screen').classList.add('d-none');
  document.getElementById('register-form').classList.add('d-none');
  document.getElementById('login-form').classList.remove('d-none');
}

// Mostrar o registro
function showRegister() {
  document.getElementById('login-register-screen').classList.add('d-none');
  document.getElementById('login-form').classList.add('d-none');
  document.getElementById('register-form').classList.remove('d-none');
}

// Carregar contas ao iniciar
(async function () {
  await loadAccounts();
})();
