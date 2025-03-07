function mudar_ondas() {
    ['at', 'e1', 'e2'].forEach(prefix => {
        const bits = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_bit${i}`));
        const linhas_horizontais = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_linha_bit${i}`));
        const linhas_verticais = Array.from({ length: 7 }, (_, i) => document.getElementById(`${prefix}_lv_${i}`));

        bits.forEach((bit, i) => {
            const valorBit = bit.value;

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
                bit.value = "";
            }
        });

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

const canvas = document.getElementById("waveCanvas");
const context = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 350;

let pulseType = "positive";

function drawWave(clockTime) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const midY = canvas.height;
    const amplitude = 80;
    const scale = 5;
    const tHigh = clockTime * scale;
    const tLow = clockTime * scale;

    context.beginPath();
    context.moveTo(50, 0);
    context.lineTo(50, canvas.height);
    context.moveTo(50, midY);
    context.lineTo(canvas.width, midY);
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();

    context.font = "14px Arial";
    context.fillStyle = "black";
    context.fillText("1", 30, midY - amplitude - 5);
    context.fillText("0", 30, midY + 15);
    context.fillText("t", canvas.width - 20, midY + 20);

    let x = 50;
    context.beginPath();
    context.moveTo(x, pulseType === "positive" ? midY : midY - amplitude);

    while (x < canvas.width) {
        if (pulseType === "positive") {
            context.lineTo(x + tHigh / 4, midY - amplitude);
            context.lineTo(x + (3 * tHigh) / 4, midY - amplitude);
            x += tHigh;
            context.lineTo(x, midY - amplitude);
            context.lineTo(x + tLow / 4, midY);
            context.lineTo(x + (3 * tLow) / 4, midY);
            x += tLow;
            context.lineTo(x, midY);
        } else {
            context.lineTo(x + tHigh / 4, midY);
            context.lineTo(x + (3 * tHigh) / 4, midY);
            x += tHigh;
            context.lineTo(x, midY);
            context.lineTo(x + tLow / 4, midY - amplitude);
            context.lineTo(x + (3 * tLow) / 4, midY - amplitude);
            x += tLow;
            context.lineTo(x, midY - amplitude);
        }
    }

    context.strokeStyle = "red";
    context.lineWidth = 4;
    context.stroke();
}

function updateWave() {
    let clockTime = parseInt(document.getElementById("clockTime").value) || 100;
    if (clockTime < 1) {
        document.getElementById("clockTime").value = 1;
        clockTime = 1;
    } else if (clockTime > 150) {
        document.getElementById("clockTime").value = 150;
        clockTime = 150;
    }
    drawWave(clockTime);
}

function selectPulse(type) {
    pulseType = type;
    updateWave();
}

document.getElementById("clockTime").addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
    updateWave();
});

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    const clockTime = parseInt(document.getElementById("clockTime").value) || 100;
    const period = clockTime * 5 * 2;
    const midY = canvas.height / 2;
    const amplitude = 80;

    const relativeX = x - 50; 
    if (relativeX < 0) return; // Fora do eixo

    const cyclePosition = relativeX % period;

    // Definir os pontos de transição
    const subidaStart = 0;
    const subidaEnd = period / 4;
    const descidaStart = period / 2;
    const descidaEnd = (3 * period) / 4;

    if (cyclePosition >= subidaStart && cyclePosition < subidaEnd) {
        canvas.title = "Borda de Subida: Ocorre quando o sinal faz a transição do nível baixo (0 lógico) para o nível alto (1 lógico). Essa transição representa uma ativação do sinal, a saída do estado de repouso.";
    } else if (cyclePosition >= descidaStart && cyclePosition < descidaEnd) {
        canvas.title = "Borda de Descida: Ocorre quando o sinal faz a transição do nível alto (1 lógico) para o nível baixo (0 lógico). Essa transição representa o retorno ao estado de repouso.";
    } else {
        canvas.title = "";
    }
});

document.getElementById("clockTime").value = 100;
updateWave();

let clockInterval;
let currentPulseState = 0;
let transitionType = "positive";
let ultimoCampoAlterado = "frequencia";

function atualizarClock(event) {
    const frequencia = parseFloat(document.getElementById("frequencia").value);
    const periodo = parseFloat(document.getElementById("periodo").value);

    if (event?.target.id === "frequencia") {
        ultimoCampoAlterado = "frequencia";
    } else if (event?.target.id === "periodo") {
        ultimoCampoAlterado = "periodo";
    }

    if (ultimoCampoAlterado === "frequencia" && !isNaN(frequencia) && frequencia > 0) {
        document.getElementById("periodo").value = (1000 / frequencia).toFixed(2);
    } else if (ultimoCampoAlterado === "periodo" && !isNaN(periodo) && periodo > 0) {
        document.getElementById("frequencia").value = (1000 / periodo).toFixed(2);
    }

    if (clockInterval) {
        clearInterval(clockInterval);
    }

    const novoPeriodo = parseFloat(document.getElementById("periodo").value);
    if (!isNaN(novoPeriodo) && novoPeriodo > 0) {
        clockInterval = setInterval(gerarPulso, novoPeriodo);
    }
}

function gerarPulso() {
    currentPulseState = currentPulseState === 0 ? 1 : 0;

    const bitsClock = Array.from({ length: 8 }, (_, i) => document.getElementById(`clk_bit${i}`));
    const linhasHorizontaisClock = Array.from({ length: 8 }, (_, i) => document.getElementById(`clk_linha_bit${i}`));
    const linhasVerticaisClock = Array.from({ length: 7 }, (_, i) => document.getElementById(`clk_lv_${i}`));

    bitsClock.forEach((bit, i) => {
        bit.innerText = currentPulseState;
        if (currentPulseState === 0) {
            linhasHorizontaisClock[i].classList.add("linha_horizontal_0");
            linhasHorizontaisClock[i].classList.remove("linha_horizontal_1");
        } else {
            linhasHorizontaisClock[i].classList.add("linha_horizontal_1");
            linhasHorizontaisClock[i].classList.remove("linha_horizontal_0");
        }
    });

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
        if (bit) {
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

document.getElementById("transicaoPositiva").addEventListener("change", () => {
    transitionType = "positive";
    atualizarClock();
});

document.getElementById("transicaoNegativa").addEventListener("change", () => {
    transitionType = "negative";
    atualizarClock();
});

document.getElementById("frequencia").addEventListener("input", atualizarClock);
document.getElementById("periodo").addEventListener("input", atualizarClock);
