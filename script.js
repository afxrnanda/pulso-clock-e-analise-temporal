function mudar_ondas() {
    ['at', 'e1', 'e2'].forEach(prefix => {
        const bits = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_bit${i}`));
        const linhas_horizontais = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_linha_bit${i}`));
        const linhas_verticais = Array.from({ length: 7 }, (_, i) => document.getElementById(`${prefix}_lv_${i}`));

        bits.forEach((bit, i) => {
            const valorBit = bit.value; // Pega o valor do input

            if (valorBit == 0) {
                linhas_horizontais[i].classList.add("linha_horizontal_0");
                linhas_horizontais[i].classList.remove("linha_horizontal_1");
            } else if (valorBit == 1) {
                linhas_horizontais[i].classList.add("linha_horizontal_1");
                linhas_horizontais[i].classList.remove("linha_horizontal_0");
            } else if (valorBit == undefined || valorBit === "") {
                console.log(`valor do bit ${valorBit} não definido.`);
            } else {
                alert("Bits seguem um sistema de base 2 (binário), ou seja, os valores só podem ser 0 ou 1.");
                bit.value = ""; // Limpa o input com valor inválido
            }
        });

        // Atualiza as linhas verticais após processar as linhas horizontais
        linhas_verticais.forEach((linha, i) => {
            const mesma_classe =
                (linhas_horizontais[i].classList.contains("linha_horizontal_0") && linhas_horizontais[i + 1].classList.contains("linha_horizontal_0")) ||
                (linhas_horizontais[i].classList.contains("linha_horizontal_1") && linhas_horizontais[i + 1].classList.contains("linha_horizontal_1"));

            if (mesma_classe) {
                linha.classList.add("linha_vertical_invisivel");
            } else {
                linha.classList.remove("linha_vertical_invisivel");
            }
        });
    });
}

//------------------
const canvas = document.getElementById("waveCanvas");
const context = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;

let pulseType = "positive"; // Tipo de pulso padrão

function drawWave(clockTime) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const midY = canvas.height / 2;
    const amplitude = 80;

    // Desenha os eixos X e Y
    context.beginPath();
    context.moveTo(50, 0);
    context.lineTo(50, canvas.height);
    context.moveTo(50, midY);
    context.lineTo(canvas.width, midY);
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();

    let x = 50;  // Começa a partir de 50px (depois do eixo Y)
    context.beginPath();
    context.moveTo(x, midY);

    // Converte tempo para pixels (escala: 1ms = 2px)
    const scale = 2;
    const pulseLength = clockTime * scale;

    while (x < canvas.width) {
        if (pulseType === "positive") {
            context.lineTo(x, midY - amplitude);
            x += pulseLength;
            context.lineTo(x, midY - amplitude);
            context.lineTo(x, midY);
        } else {
            context.lineTo(x, midY + amplitude);
            x += pulseLength;
            context.lineTo(x, midY + amplitude);
            context.lineTo(x, midY);
        }
    }

    context.strokeStyle = "red";
    context.lineWidth = 4;
    context.stroke();
}

function updateWave() {
    const clockTime = parseInt(document.getElementById("clockTime").value) || 100;
    drawWave(clockTime);
}

function selectPulse(type) {
    pulseType = type;
    updateWave();
}

// Configuração inicial
document.getElementById("clockTime").value = 100; // Valor padrão
updateWave(); // Desenha o gráfico inicial

let clockInterval; // Variável para armazenar o intervalo do clock
let currentPulseState = 0; // Estado atual do pulso (0 ou 1)
let transitionType = "positive"; // Tipo de transição (positiva ou negativa)
let ultimoCampoAlterado = "frequencia"; // Rastreia qual campo foi alterado por último

function atualizarClock(event) {
    const frequencia = parseFloat(document.getElementById("frequencia").value);
    const periodo = parseFloat(document.getElementById("periodo").value);

    // Determina qual campo foi alterado
    if (event?.target.id === "frequencia") {
        ultimoCampoAlterado = "frequencia";
    } else if (event?.target.id === "periodo") {
        ultimoCampoAlterado = "periodo";
    }

    // Se a frequência foi alterada, recalcula o período
    if (ultimoCampoAlterado === "frequencia" && !isNaN(frequencia) && frequencia > 0) {
        document.getElementById("periodo").value = (1000 / frequencia).toFixed(2);
    } 
    // Se o período foi alterado, recalcula a frequência
    else if (ultimoCampoAlterado === "periodo" && !isNaN(periodo) && periodo > 0) {
        document.getElementById("frequencia").value = (1000 / periodo).toFixed(2);
    }

    // Limpa o clock anterior antes de iniciar um novo
    if (clockInterval) {
        clearInterval(clockInterval);
    }

    // Define novo período do clock
    const novoPeriodo = parseFloat(document.getElementById("periodo").value);
    if (!isNaN(novoPeriodo) && novoPeriodo > 0) {
        clockInterval = setInterval(gerarPulso, novoPeriodo);
    }
}

function gerarPulso() {
    // Alterna o estado do pulso (0 → 1 ou 1 → 0)
    currentPulseState = currentPulseState === 0 ? 1 : 0;

    // Obtém os bits do clock e suas linhas visuais
    const bitsClock = Array.from({ length: 8 }, (_, i) => document.getElementById(`clk_bit${i}`));
    const linhasHorizontaisClock = Array.from({ length: 8 }, (_, i) => document.getElementById(`clk_linha_bit${i}`));
    const linhasVerticaisClock = Array.from({ length: 7 }, (_, i) => document.getElementById(`clk_lv_${i}`));

    // Atualiza os bits e as linhas horizontais do clock
    bitsClock.forEach((bit, i) => {
        bit.innerText = currentPulseState; // Atualiza o texto do <p> para 0 ou 1
        if (currentPulseState === 0) {
            linhasHorizontaisClock[i].classList.add("linha_horizontal_0");
            linhasHorizontaisClock[i].classList.remove("linha_horizontal_1");
        } else {
            linhasHorizontaisClock[i].classList.add("linha_horizontal_1");
            linhasHorizontaisClock[i].classList.remove("linha_horizontal_0");
        }
    });

    // Atualiza as linhas verticais do clock
    linhasVerticaisClock.forEach((linha, i) => {
        const mesmaClasse =
            (linhasHorizontaisClock[i].classList.contains("linha_horizontal_0") && linhasHorizontaisClock[i + 1].classList.contains("linha_horizontal_0")) ||
            (linhasHorizontaisClock[i].classList.contains("linha_horizontal_1") && linhasHorizontaisClock[i + 1].classList.contains("linha_horizontal_1"));

        if (mesmaClasse) {
            linha.classList.add("linha_vertical_invisivel");
        } else {
            linha.classList.remove("linha_vertical_invisivel");
        }
    });

    // Verifica o tipo de transição (positiva ou negativa)
    if (transitionType === "positive") {
        if (currentPulseState === 1) {
            processarEntradas();
        } else {
            resetarSaidaParaZero();
        }
    } else if (transitionType === "negative") {
        if (currentPulseState === 0) {
            processarEntradas();
        } else {
            resetarSaidaParaZero();
        }
    }
}

function resetarSaidaParaZero() {
    const bitsS = Array.from({ length: 8 }, (_, i) => document.getElementById(`s_bit${i}`));
    
    bitsS.forEach((bit, i) => {
        if (bit) { // Verifica se o elemento existe antes de acessar innerText
            bit.innerText = 0;
        }

        const linha = document.getElementById(`s_linha_bit${i}`);
        if (linha) { 
            linha.classList.add("linha_horizontal_0");
            linha.classList.remove("linha_horizontal_1");
        }

        const vertical = document.getElementById(`s_lv_${i}`);
        if (vertical) {
            vertical.classList.add("linha_vertical_invisivel");
        }
    });
}


function processarEntradas() {
    const bitsE1 = Array.from({ length: 8 }, (_, i) => parseInt(document.getElementById(`e1_bit${i}`).value));
    const bitsE2 = Array.from({ length: 8 }, (_, i) => parseInt(document.getElementById(`e2_bit${i}`).value));

    const operacao = document.getElementById("operacao").value;

    let bitsSaida;
    switch (operacao) {
        case "AND":
            bitsSaida = bitsE1.map((bitE1, i) => bitE1 & bitsE2[i]);
            break;
        case "OR":
            bitsSaida = bitsE1.map((bitE1, i) => bitE1 | bitsE2[i]);
            break;
        case "XOR":
            bitsSaida = bitsE1.map((bitE1, i) => bitE1 ^ bitsE2[i]);
            break;
        case "NOT":
            bitsSaida = bitsE1.map(bitE1 => bitE1 === 0 ? 1 : 0);
            break;
        default:
            bitsSaida = bitsE1;
    }

    // Atualiza a saída (S) com as classes CSS correspondentes
    const bitsS = Array.from({ length: 8 }, (_, i) => document.getElementById(`s_bit${i}`));
    bitsSaida.forEach((bit, i) => {
        bitsS[i].innerText = bit;

        const linhaHorizontal = document.getElementById(`s_linha_bit${i}`);
        if (bit === 0) {
            linhaHorizontal.classList.add("linha_horizontal_0");
            linhaHorizontal.classList.remove("linha_horizontal_1");
        } else {
            linhaHorizontal.classList.add("linha_horizontal_1");
            linhaHorizontal.classList.remove("linha_horizontal_0");
        }
    });

    // Atualiza as linhas verticais com base nos bits de saída
    const linhasVerticais = Array.from({ length: 7 }, (_, i) => document.getElementById(`s_lv_${i}`));
    linhasVerticais.forEach((linha, i) => {
        const mesmaClasse =
            (bitsS[i].innerText === "0" && bitsS[i + 1].innerText === "0") ||
            (bitsS[i].innerText === "1" && bitsS[i + 1].innerText === "1");

        if (mesmaClasse) {
            linha.classList.add("linha_vertical_invisivel");
        } else {
            linha.classList.remove("linha_vertical_invisivel");
        }
    });
}

// Funções para alternar o tipo de transição
document.getElementById("transicaoPositiva").addEventListener("change", () => {
    transitionType = "positive";
    atualizarClock();
});

document.getElementById("transicaoNegativa").addEventListener("change", () => {
    transitionType = "negative";
    atualizarClock();
});

// Inicializa os eventos para os campos de frequência e período
document.getElementById("frequencia").addEventListener("input", atualizarClock);
document.getElementById("periodo").addEventListener("input", atualizarClock);
