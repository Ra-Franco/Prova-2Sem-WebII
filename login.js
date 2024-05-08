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
            <button>Cadastrar</button>
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
        <button @click="alterarTemplate('Login')">Login</button>
        <button @click="alterarTemplate('SignUp')">Sign Up</button>
    </div>  

    <script>
    `
}

createApp({
    // data() {
    //     return {
    //         estadoAtual: "Login"
    //     }
    // },
    setup() {
        const estadoAtual = 'Login'
        return { estadoAtual }
    },
    methods: {
        alterarTemplate(val) {
            console.log(val)
            this.estadoAtual = val;
        }
    },
    components: {
        Login,
        SignUp
    }
}).mount("#app")