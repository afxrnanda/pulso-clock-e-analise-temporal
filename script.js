function mudar_ondas() {
    ['at', 'clk', 's', 'e1', 'e2'].forEach(prefix => {
        const bits = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_bit${i}`).value);
        const linhas_horizontais = Array.from({ length: 8 }, (_, i) => document.getElementById(`${prefix}_linha_bit${i}`));
        const linhas_verticais = Array.from({ length: 7 }, (_, i) => document.getElementById(`${prefix}_lv_${i}`));

        bits.forEach((bit, i) => {
            if (bit == 0) {
                linhas_horizontais[i].classList.add("linha_horizontal_0");
                linhas_horizontais[i].classList.remove("linha_horizontal_1");
            } else if (bit == 1) {
                linhas_horizontais[i].classList.add("linha_horizontal_1");
                linhas_horizontais[i].classList.remove("linha_horizontal_0");
            } else {
                console.log("Erro: número maior que 1 ou menor que 0");
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

    // Verifica qual campo foi alterado
    if (event && event.target.id === "frequencia") {
        ultimoCampoAlterado = "frequencia";
    } else if (event && event.target.id === "periodo") {
        ultimoCampoAlterado = "periodo";
    }

    // Se a frequência foi alterada, atualize o período
    if (ultimoCampoAlterado === "frequencia" && !isNaN(frequencia)) {
        const novoPeriodo = (1 / frequencia) * 1000; // Converte Hz para ms
        document.getElementById("periodo").value = novoPeriodo.toFixed(2);
    }
    // Se o período foi alterado, atualize a frequência
    else if (ultimoCampoAlterado === "periodo" && !isNaN(periodo)) {
        const novaFrequencia = (1 / (periodo / 1000)).toFixed(2); // Converte ms para Hz
        document.getElementById("frequencia").value = novaFrequencia;
    }

    // Limpa o intervalo anterior, se existir
    if (clockInterval) {
        clearInterval(clockInterval);
    }

    // Configura o novo intervalo com base no período
    const novoPeriodo = parseFloat(document.getElementById("periodo").value);
    if (!isNaN(novoPeriodo) && novoPeriodo > 0) {
        clockInterval = setInterval(gerarPulso, novoPeriodo);
    }
}

function gerarPulso() {
    // Atualiza o estado do clock
    const bitsClock = Array.from({ length: 8 }, (_, i) => document.getElementById(`clk_bit${i}`));
    const linhasHorizontaisClock = Array.from({ length: 8 }, (_, i) => document.getElementById(`clk_linha_bit${i}`));
    const linhasVerticaisClock = Array.from({ length: 7 }, (_, i) => document.getElementById(`clk_lv_${i}`));

    // Alterna o estado do pulso (0 ou 1)
    currentPulseState = currentPulseState === 0 ? 1 : 0;

    // Atualiza os bits e as linhas horizontais do clock
    bitsClock.forEach((bit, i) => {
        bit.value = currentPulseState;
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
    const transicaoPositiva = document.getElementById("transicaoPositiva").checked;

    // Define o estado da saída com base no clock e no tipo de transição
    let bitsSaida;
    if ((transicaoPositiva && currentPulseState === 1) || (!transicaoPositiva && currentPulseState === 0)) {
        // Lê as entradas (E1 e E2)
        const bitsE1 = Array.from({ length: 8 }, (_, i) => parseInt(document.getElementById(`e1_bit${i}`).value));
        const bitsE2 = Array.from({ length: 8 }, (_, i) => parseInt(document.getElementById(`e2_bit${i}`).value));

        // Obtém a operação lógica selecionada
        const operacao = document.getElementById("operacao").value;

        // Processa as entradas com base na operação selecionada
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
                bitsSaida = bitsE1; // Padrão: mantém E1
        }
    } else {
        // Se o clock não permitir atualização, zera a saída
        bitsSaida = Array.from({ length: 8 }, () => 0);
    }

    // Atualiza a saída (S)
    const bitsS = Array.from({ length: 8 }, (_, i) => document.getElementById(`s_bit${i}`));
    const linhasHorizontaisS = Array.from({ length: 8 }, (_, i) => document.getElementById(`s_linha_bit${i}`));
    const linhasVerticaisS = Array.from({ length: 7 }, (_, i) => document.getElementById(`s_lv_${i}`));

    bitsSaida.forEach((bit, i) => {
        bitsS[i].value = bit;
        if (bit === 0) {
            linhasHorizontaisS[i].classList.add("linha_horizontal_0");
            linhasHorizontaisS[i].classList.remove("linha_horizontal_1");
        } else {
            linhasHorizontaisS[i].classList.add("linha_horizontal_1");
            linhasHorizontaisS[i].classList.remove("linha_horizontal_0");
        }
    });

    // Atualiza as linhas verticais da saída
    linhasVerticaisS.forEach((linha, i) => {
        const mesmaClasse =
            (linhasHorizontaisS[i].classList.contains("linha_horizontal_0") && linhasHorizontaisS[i + 1].classList.contains("linha_horizontal_0")) ||
            (linhasHorizontaisS[i].classList.contains("linha_horizontal_1") && linhasHorizontaisS[i + 1].classList.contains("linha_horizontal_1"));

        if (mesmaClasse) {
            linha.classList.add("linha_vertical_invisivel");
        } else {
            linha.classList.remove("linha_vertical_invisivel");
        }
    });
}

// Função para selecionar o tipo de transição
document.getElementById("transicaoPositiva").addEventListener("change", () => {
    transitionType = "positive";
    atualizarClock();
});

document.getElementById("transicaoNegativa").addEventListener("change", () => {
    transitionType = "negative";
    atualizarClock();
});

// Inicializa o clock com valores padrão
document.getElementById("frequencia").addEventListener("input", atualizarClock);
document.getElementById("periodo").addEventListener("input", atualizarClock);