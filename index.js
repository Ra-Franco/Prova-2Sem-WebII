const { createApp } = Vue
const URL = 'https://prova-2sem-webii.onrender.com';

createApp({
    data() {
        return {
            heroi: { vida: 100, morto: false, isDefendendo: false },
            vilao: { vida: 100, morto: false, isDefendendo: false },
            isHeroi: true,
            turnoLista: [],
        }
    },
    methods: {
        async atualizarVidaBanco(vidaHeroi, vidaVilao) {
            try {
                const response = await fetch(`https://prova-2sem-webii.onrender.com/atualizarVida`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        vidaHeroi, vidaVilao
                    })
                })
                console.log(response)
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a vida no banco')
                }
                console.log('Vida atualizada no banco')
            } catch (e) {
                console.error('Erro ao atualizar vida no banco: ', e)
            }
        },
        async atacar(isHeroi) {
            let dano = this.randomIntFromInterval(5, 25)
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
            }
            this.atualizarVidaBanco(this.heroi.vida, this.vilao.vida)
            this.logTurno("Ataque")
            await this.trocaTurno()
            await this.morrer()
        },
        async defender(isHeroi) {
            if (isHeroi) {
                this.heroi.isDefendendo = true
            } else {
                this.vilao.isDefendendo = true
            }
            this.logTurno("Defendeu")
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
            }
            this.atualizarVidaBanco(this.heroi.vida, this.vilao.vida)
            this.logTurno("Usou poção")
            await this.trocaTurno()
        },
        async correr() {
            const run = this.randomIntFromInterval(0, 1)
            if (run == 1) {
                alert("Correu! Game Over")
            }
            this.logTurno("Usou correr")
            await this.trocaTurno()
        },
        acaoVilao(isHeroi) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (!isHeroi) {
                        const acoes = [
                            'atacar', 'defender', 'usarPocao'
                        ]
                        const acaoAleatorio = acoes[Math.floor(Math.random() * acoes.length)]
                        resolve(this[acaoAleatorio](), 0)
                    }
                })
            })
        },
        morrer() {
            return new Promise((resolve) => {
                if (this.heroi.vida <= 0) {
                    alert("Você perdeu!")
                }
                if (this.vilao.vida <= 0) {
                    alert("Você ganhou!")
                }
            })
        },
        corVida(vida) {
            if (vida < 30) {
                return 'red'
            } else if (vida < 60) {
                return 'rgb(161, 175, 29)'
            } else {
                return 'green'
            }
        },
        randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        async trocaTurno() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.isHeroi = !this.isHeroi;
                    if (!this.isHeroi) {
                        this.acaoVilao(this.isHeroi);
                    }
                    resolve(this.isHeroi);
                }, 0);
            });
        },
        logTurno(turno) {
            let pers = this.isHeroi ? "Herói" : "Vilão"
            this.turnoLista.push({ personagem: pers, opcao: turno })
            console.log(this.turnoLista)
            localStorage.setItem("TurnoLista", JSON.stringify(this.turnoLista))
        },
    }

}).mount("#app")
