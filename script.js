function mudar_ondas() {
    const bits = Array.from({ length: 8 }, (_, i) => document.getElementById(`at_bit${i}`).value);
    
    const linhas_horizontais = Array.from({ length: 8 }, (_, i) => document.getElementById(`linha_bit${i}`));
    
    const linhas_verticais = Array.from({ length: 7 }, (_, i) => document.getElementById(`lv_${i}`));

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
}
