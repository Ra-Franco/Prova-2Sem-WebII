const { createApp } = Vue

const Login = {
    template: `
    <div class="box">
    <h2>Login</h2>
    <div class="box-item">
        <div class="inputs">
            <input type="text" placeholder="Login">
            <input type="text" placeholder="Senha">
        </div>
        <div class="buttons">
            <button>Entrar</button>
            <button>Sign Up</button>
        </div>
    </div>
</div>
    `
}

const SignUp = {
    template: `
    <h1>Faça seu cadastro</h1>
        <div class="cadastro">
            <label>Login</label>
            <input type="text">
            <label>Email</label>
            <input type="email">
            <label for="">Senha</label>
            <input type="password"> 
        </div>
        <div class="box-butons">
        <button @click="alterarTemplate">Login</button>
        <button @click="alterarTemplate">Sign Up</button>
    </div>  
    `
}

createApp({
    data() {
        return {
            estadoAtual: "Login"
        }
    },
    methods: {
        alterarTemplate() {
            if (this.estadoAtual == "Login") {
                this.estadoAtual == "SignUp"
            } else {
                this.estadoAtual == "Login"
            };
        }
    },
    components: {
        Login,
        SignUp
    }
}).mount("#app")