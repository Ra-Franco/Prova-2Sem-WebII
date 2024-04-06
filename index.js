const { createApp } = Vue

createApp({
    data() {
        return {
            heroi: { vida: 100, morto: false, isDefendendo: false },
            vilao: { vida: 100, morto: false, isDefendendo: false },
            isHeroi: true
        }
    },
    methods: {
        async atacar(isHeroi) {
            let dano = isHeroi ? this.randomIntFromInterval(1, 25) : this.randomIntFromInterval(0, 10)
            if (isHeroi) {
                if (this.vilao.isDefendendo) {
                    dano *= 0.3
                    this.vilao.isDefendendo = false
                }
                this.vilao.vida -= dano
            } else {
                if (this.heroi.isDefendendo) {
                    dano *= 0.3
                    this.heroi.isDefendendo = false
                }
                this.heroi.vida -= dano
                console.log("Atk vilao")
            }
            await this.trocaTurno()
            await this.morrer()
        },
        async defender(isHeroi) {
            if (isHeroi) {
                this.isHeroi = false
            } else {
                this.isHeroi = true
                console.log("Defende vilao")
            }
            await this.trocaTurno()
        },
        async usarPocao(isHeroi) {
            let cura = 0;
            if (isHeroi) {
                if (this.heroi.vida > 70) {
                    cura = this.randomIntFromInterval(0, 100 - this.heroi.vida)
                } else {
                    cura = (this.randomIntFromInterval(10, 30))
                }
                this.heroi.vida += cura
            } else {
                if (this.vilao.vida > 70) {
                    cura = this.randomIntFromInterval(0, 100 - this.vilao.vida)
                } else {
                    cura = (this.randomIntFromInterval(10, 30))
                }
                this.vilao.vida += cura
                console.log("cura vilao")
            }
            await this.trocaTurno()
        },
        correr() {
            const run = this.randomIntFromInterval(0, 1)
            if (run == 1) {
                console.log("Correu")
            }
        },
        acaoVilao(isHeroi) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (!isHeroi) {
                        const acoes = [
                            'atacar', 'defender', 'usarPocao'
                        ]
                        const acaoAleatorio = acoes[Math.floor(Math.random() * acoes.length)]
                        resolve(this[acaoAleatorio](false), 1000)
                    }
                })
            })
        },
        morrer() {
            return new Promise((resolve) => {
                if (this.heroi.vida <= 0) {
                    resolve(this.heroi.morto = true)
                }
                if (this.vilao.vida <= 0) {
                    resolve(this.vilao.morto = true)
                }
            })
        },
        corVida(vida) {
            if (vida < 30) {
                return 'red'
            } else if (vida < 60) {
                return 'yellow'
            } else {
                return 'green'
            }
        },
        randomIntFromInterval(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        async trocaTurno() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (this.isHeroi) {
                        resolve(this.isHeroi = false)
                    } else {
                        console.log("Turno vilão")
                        resolve(this.isHeroi = true)
                        this.acaoVilao()
                    }
                }, 1000)
            })
        }
    }
}).mount("#app")