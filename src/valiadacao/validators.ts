export function min(valor: string | number, tamanhoMinimo: Number) {
  if (typeof valor === "number") {
    if (valor < tamanhoMinimo) {
      return `Não pode ser menor que ${tamanhoMinimo}`;
    }
  } else if (valor.length < tamanhoMinimo) {
    return `Deve ter no mínimo ${tamanhoMinimo} caracteres`;
  }

  return "";
}

export function max(valor: string | number, tamanhoMaximo: Number) {
  if (typeof valor === "number") {
    if (valor > tamanhoMaximo) {
      return `Não pode ser maior que ${tamanhoMaximo}`;
    }
  } else if (valor.length > tamanhoMaximo) {
    return `Deve ter no máximo ${tamanhoMaximo} caracteres`;
  }
  return "";
}

export function obrigatorio(valor: string | Object) {
  if (valor === "" || valor == null || Object.entries(valor).length === 0) {
    return "Obrigatório";
  }

  return "";
}

export function isEmail(valor: string) {
  const usuario = valor.substring(0, valor.indexOf("@"));
  const dominio = valor.substring(valor.indexOf("@") + 1, valor.length);
  if (
    usuario.length >= 1 &&
    dominio.length >= 3 &&
    usuario.search("@") === -1 &&
    dominio.search("@") === -1 &&
    usuario.search(" ") === -1 &&
    dominio.search(" ") === -1 &&
    dominio.search(".") !== -1 &&
    dominio.indexOf(".") >= 1 &&
    dominio.lastIndexOf(".") < dominio.length - 1
  ) {
    return "";
  }
  return "Digite um e-mail válido";
}
