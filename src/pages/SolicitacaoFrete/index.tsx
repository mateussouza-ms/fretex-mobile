import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, Image } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { CheckBox, Overlay } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-community/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { format } from "date-fns";
import { parse } from "fast-xml-parser";
import PageHeader from "../../components/PageHeader";

import { max, obrigatorio, min } from "../../valiadacao/validators";

import iconeSetaCima from "../../assets/images/icons/icone-seta-cima.png";
import iconeSetaBaixo from "../../assets/images/icons/icone-seta-baixo.png";

import api from "../../services/api";
import apiCorreios from "../../services/apiCorreios";

import styles from "./styles";
import Loader from "../../components/Loader";

interface UF {
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
  uf: string;
}

interface respostaWsCorreios {
  "soap:Envelope": {
    "soap:Body": {
      "ns2:consultaCEPResponse": {
        return: {
          bairro: string;
          cep: string;
          cidade: string;
          complemento2: string;
          end: string;
          uf: string;
        };
      };
    };
  };
}

function SolicitacaoFrete() {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showDatePickerRetirada, setShowDatePickerRetirada] = useState(false);
  const [showDatePickerEntrega, setShowDatePickerEntrega] = useState(false);
  const [negociaDatas, setNegociaDatas] = useState(true);

  const [tipoCarga, setTipoCarga] = useState("");
  const [peso, setPeso] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [
    dataRetiradaPretendida,
    setDataRetiradaPretendida,
  ] = useState<Date | null>(null);
  const [
    dataEntregaPretendida,
    setDataEntregaPretendida,
  ] = useState<Date | null>(null);

  const [enderecoRetiradaCep, setEnderecoRetiradaCep] = useState("");
  const [enderecoRetiradaLogradouro, setEnderecoRetiradaLogradouro] = useState(
    ""
  );
  const [enderecoRetiradaNumero, setEnderecoRetiradaNumero] = useState("");
  const [enderecoRetiradaBairro, setEnderecoRetiradaBairro] = useState("");
  const [
    enderecoRetiradaComplemento,
    setEnderecoRetiradaComplemento,
  ] = useState("");
  const [enderecoRetiradaUf, setEnderecoRetiradaUf] = useState({});
  const [enderecoRetiradaCidade, setEnderecoRetiradaCidade] = useState<Cidade>({
    id: 0,
    nome: "",
    uf: "",
  });

  const [enderecoEntregaCep, setEnderecoEntregaCep] = useState("");
  const [enderecoEntregaLogradouro, setEnderecoEntregaLogradouro] = useState(
    ""
  );
  const [enderecoEntregaNumero, setEnderecoEntregaNumero] = useState("");
  const [enderecoEntregaBairro, setEnderecoEntregaBairro] = useState("");
  const [enderecoEntregaComplemento, setEnderecoEntregaComplemento] = useState(
    ""
  );
  const [enderecoEntregaUf, setEnderecoEntregaUf] = useState({});
  const [enderecoEntregaCidade, setEnderecoEntregaCidade] = useState<Cidade>({
    id: 0,
    nome: "",
    uf: "",
  });

  const [erroApi, setErroApi] = useState("");
  const [visible, setVisible] = useState(false);
  const [formSubmetido, setFormSubmetido] = useState(false);
  const [isEnderecoRetiradaVisible, setIsEnderecoRetiradaVisible] = useState(
    false
  );
  const [isEnderecoEntregaVisible, setIsEnderecoEntregaVisible] = useState(
    false
  );
  const [estados, setEstados] = useState([]);
  const [cidadesEnderecoRetirada, setCidadesEnderecoRetirada] = useState<
    Cidade[]
  >([]);
  const [cidadesEnderecoEntrega, setCidadesEnderecoEntrega] = useState<
    Cidade[]
  >([]);

  const errors = {
    tipoCarga: obrigatorio(tipoCarga) || max(tipoCarga, 120),
    peso: obrigatorio(peso) || min(Number.parseFloat(peso), 0),
    observacoes: max(observacoes, 120),

    enderecoRetiradaCep:
      obrigatorio(enderecoRetiradaCep) ||
      min(enderecoRetiradaCep, 8) ||
      max(enderecoRetiradaCep, 8),

    enderecoRetiradaLogradouro:
      obrigatorio(enderecoRetiradaLogradouro) ||
      max(enderecoRetiradaLogradouro, 120),

    enderecoRetiradaNumero:
      obrigatorio(enderecoRetiradaNumero) || max(enderecoRetiradaNumero, 20),

    enderecoRetiradaBairro:
      obrigatorio(enderecoRetiradaBairro) || max(enderecoRetiradaBairro, 50),

    enderecoRetiradaComplemento: max(enderecoRetiradaComplemento, 120),
    enderecoRetiradaUf: obrigatorio(enderecoRetiradaUf),
    enderecoRetiradaCidade: obrigatorio(enderecoRetiradaCidade),

    enderecoEntregaCep:
      obrigatorio(enderecoEntregaCep) ||
      min(enderecoEntregaCep, 8) ||
      max(enderecoEntregaCep, 8),

    enderecoEntregaLogradouro:
      obrigatorio(enderecoEntregaLogradouro) ||
      max(enderecoEntregaLogradouro, 120),

    enderecoEntregaNumero:
      obrigatorio(enderecoEntregaNumero) || max(enderecoEntregaNumero, 20),

    enderecoEntregaBairro:
      obrigatorio(enderecoEntregaBairro) || max(enderecoEntregaBairro, 50),

    enderecoEntregaComplemento: max(enderecoEntregaComplemento, 120),
    enderecoEntregaUf: obrigatorio(enderecoEntregaUf),
    enderecoEntregaCidade: obrigatorio(enderecoEntregaCidade),
  };

  const formPreenchido =
    tipoCarga !== "" &&
    peso !== "" &&
    enderecoRetiradaCep !== "" &&
    enderecoRetiradaLogradouro !== "" &&
    enderecoRetiradaNumero !== "" &&
    enderecoRetiradaBairro !== "" &&
    Object.entries(enderecoRetiradaCidade).length > 0 &&
    enderecoEntregaCep !== "" &&
    enderecoEntregaLogradouro !== "" &&
    enderecoEntregaNumero !== "" &&
    enderecoEntregaBairro !== "" &&
    Object.entries(enderecoEntregaCidade).length > 0;

  const formValido =
    !errors.tipoCarga &&
    !errors.peso &&
    !errors.observacoes &&
    !errors.enderecoRetiradaCep &&
    !errors.enderecoRetiradaLogradouro &&
    !errors.enderecoRetiradaNumero &&
    !errors.enderecoRetiradaBairro &&
    !errors.enderecoRetiradaComplemento &&
    !errors.enderecoRetiradaCidade &&
    !errors.enderecoEntregaCep &&
    !errors.enderecoEntregaLogradouro &&
    !errors.enderecoEntregaNumero &&
    !errors.enderecoEntregaBairro &&
    !errors.enderecoEntregaComplemento &&
    !errors.enderecoEntregaCidade;

  useEffect(() => {
    if (Object.entries(estados).length === 0) {
      api.get("estados").then((response) => {
        setEstados(response.data);
      });
    }
  }, []);

  function handleChangeValueEnderecoRetiradaUf(
    value: UF,
    cidadeSelecionada?: string
  ) {
    if (value.sigla) {
      setEnderecoRetiradaUf(value);
      api
        .get("cidades", {
          params: {
            uf: value.sigla,
          },
        })
        .then((response) => {
          const cidades: Cidade[] = response.data;
          setCidadesEnderecoRetirada(cidades);
          if (cidadeSelecionada) {
            cidades.forEach((cidade) => {
              if (cidade.nome === cidadeSelecionada) {
                setEnderecoRetiradaCidade(cidade);
              }
            });
          }
        });
    }
  }

  function handleChangeValueEnderecoEntregaUf(
    value: UF,
    cidadeSelecionada?: string
  ) {
    if (value.sigla) {
      setEnderecoEntregaUf(value);
      api
        .get("cidades", {
          params: {
            uf: value.sigla,
          },
        })
        .then((response) => {
          setCidadesEnderecoEntrega(response.data);
          const cidades: Cidade[] = response.data;
          setCidadesEnderecoEntrega(cidades);
          if (cidadeSelecionada) {
            cidades.forEach((cidade) => {
              if (cidade.nome === cidadeSelecionada) {
                setEnderecoEntregaCidade(cidade);
              }
            });
          }
        });
    }
  }

  function handleChangeValueEnderecoRetiradaCidade(value: Cidade) {
    if (value) {
      setEnderecoRetiradaCidade(value);
    }
  }
  function handleChangeValueEnderecoEntregaCidade(value: Cidade) {
    if (value) {
      setEnderecoEntregaCidade(value);
    }
  }

  function handleToggleEnderecoRetiradaVisible() {
    setIsEnderecoRetiradaVisible(!isEnderecoRetiradaVisible);
  }

  function handleToggleEnderecoEntregaVisible() {
    setIsEnderecoEntregaVisible(!isEnderecoEntregaVisible);
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  async function handleSubmit() {
    setFormSubmetido(true);

    if (!formValido) {
      return;
    }

    setLoading(true);
    await api
      .post("cargas", {
        cliente: {
          id: 1,
        },
        tipoCarga,
        peso,
        enderecoRetirada: {
          cep: enderecoRetiradaCep,
          logradouro: enderecoRetiradaLogradouro,
          numero: enderecoRetiradaNumero,
          bairro: enderecoRetiradaBairro,
          complemento: enderecoRetiradaComplemento,
          cidade: {
            id: enderecoRetiradaCidade.id,
          },
        },
        enderecoEntrega: {
          cep: enderecoEntregaCep,
          logradouro: enderecoEntregaLogradouro,
          numero: enderecoEntregaNumero,
          bairro: enderecoEntregaBairro,
          complemento: enderecoEntregaComplemento,
          cidade: {
            id: enderecoEntregaCidade.id,
          },
        },
        observacoes,
        dataRetiradaPretendida,
        dataEntregaPretendida,
        negociaDatas,
      })
      .then(() => {
        navigate("ListaSolicitacoes");
      })
      .catch((error) => {
        setErroApi(JSON.stringify(error.response.data));
        toggleOverlay();
      })
      .finally(() => setLoading(false));
  }

  function buscaCep(cep: string, endereco: string) {
    if (endereco === "enderecoRetirada") {
      setEnderecoRetiradaLogradouro("");
      setEnderecoRetiradaBairro("");
      setEnderecoRetiradaComplemento("");
      setEnderecoRetiradaUf({});
      setEnderecoRetiradaCidade({
        id: 0,
        nome: "Cidade *",
        uf: "",
      });
    }

    if (endereco === "enderecoEntrega") {
      setEnderecoEntregaLogradouro("");
      setEnderecoEntregaBairro("");
      setEnderecoEntregaComplemento("");
      setEnderecoEntregaUf({});
      setEnderecoEntregaCidade({
        id: 0,
        nome: "Cidade *",
        uf: "",
      });
    }

    if (cep.length !== 8) {
      return;
    }

    const xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\
          <soapenv:Header/>\
          <soapenv:Body>\
              <cli:consultaCEP>\
                  <cep>${cep}</cep>\
              </cli:consultaCEP>\
          </soapenv:Body>\
      </soapenv:Envelope>`;

    setLoading(true);

    apiCorreios
      .post("", xml, {
        headers: { "Content-Type": "text/xml" },
        timeout: 3000,
      })
      .then((response) => {
        const resposta: respostaWsCorreios = parse(response.data);
        const { end, bairro, complemento2, cidade, uf } = resposta[
          "soap:Envelope"
        ]["soap:Body"]["ns2:consultaCEPResponse"].return;
        if (endereco === "enderecoRetirada") {
          setEnderecoRetiradaLogradouro(end);
          setEnderecoRetiradaBairro(bairro);
          setEnderecoRetiradaComplemento(complemento2);

          estados.forEach((estado: UF) => {
            if (estado.sigla === uf) {
              handleChangeValueEnderecoRetiradaUf(estado, cidade);
            }
          });

          cidadesEnderecoRetirada.forEach((cidadeLista: Cidade) => {
            if (cidadeLista.nome === cidade) {
              handleChangeValueEnderecoRetiradaCidade(cidadeLista);
            }
          });
        }

        if (endereco === "enderecoEntrega") {
          setEnderecoEntregaLogradouro(end);
          setEnderecoEntregaBairro(bairro);
          setEnderecoEntregaComplemento(complemento2);

          estados.forEach((estado: UF) => {
            if (estado.sigla === uf) {
              handleChangeValueEnderecoEntregaUf(estado, cidade);
            }
          });

          cidadesEnderecoEntrega.forEach((cidadeLista: Cidade) => {
            if (cidadeLista.nome === cidade) {
              handleChangeValueEnderecoEntregaCidade(cidadeLista);
            }
          });
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Solicitação de frete" />

      <ScrollView style={styles.scrollCampos}>
        <Text style={styles.label}>
          Carga a ser transportada: *
          {formSubmetido && errors.tipoCarga && (
            <Text style={styles.textoValidacao}>{`\b${errors.tipoCarga}`}</Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.tipoCarga ? styles.inputError : null,
          ]}
          value={tipoCarga}
          onChangeText={(text) => setTipoCarga(text)}
          placeholder="Tipo de carga. Ex: geladeira"
          maxLength={50}
        />

        <Text style={styles.label}>
          Peso: *
          {formSubmetido && errors.peso && (
            <Text style={styles.textoValidacao}>{`\b${errors.peso}`}</Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.peso ? styles.inputError : null,
          ]}
          value={peso}
          onChangeText={(text) => setPeso(text)}
          placeholder="Peso da carga (Kg)"
          keyboardType="numeric"
        />

        <Text style={styles.label}>
          Observações:
          {formSubmetido && errors.observacoes && (
            <Text style={styles.textoValidacao}>
              {`\b${errors.observacoes}`}
            </Text>
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            formSubmetido && errors.observacoes ? styles.inputError : null,
          ]}
          value={observacoes}
          onChangeText={(text) => setObservacoes(text)}
          placeholder="Observações sobre a carga"
          maxLength={120}
        />

        <Text style={styles.label}>Data pretendida para retirada:</Text>
        <TextInput
          style={styles.input}
          value={
            dataRetiradaPretendida
              ? format(
                  new Date(dataRetiradaPretendida.toString()),
                  "dd/MM/yyyy"
                )
              : ""
          }
          placeholder="Data pretendida para a carga ser retirada"
          onTouchEnd={() => setShowDatePickerRetirada(true)}
        />

        {showDatePickerRetirada && (
          <DateTimePicker
            value={dataRetiradaPretendida || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePickerRetirada(false);
              if (event.type === "set") {
                if (date) {
                  if (
                    dataEntregaPretendida &&
                    dataRetiradaPretendida &&
                    dataEntregaPretendida < date
                  ) {
                    const diferenca =
                      dataEntregaPretendida.getTime() -
                      dataRetiradaPretendida.getTime();

                    setDataEntregaPretendida(
                      new Date(date.getTime() + diferenca)
                    );
                  }
                  setDataRetiradaPretendida(date);
                }
              }
            }}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Data pretendida para entrega:</Text>
        <TextInput
          style={styles.input}
          value={
            dataEntregaPretendida
              ? format(new Date(dataEntregaPretendida.toString()), "dd/MM/yyyy")
              : ""
          }
          placeholder="Data pretendida para a carga ser entregue"
          onTouchEnd={() => setShowDatePickerEntrega(true)}
        />

        {showDatePickerEntrega && (
          <DateTimePicker
            value={dataEntregaPretendida || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePickerEntrega(false);
              if (event.type === "set") {
                setDataEntregaPretendida(date || new Date());
              }
            }}
            minimumDate={dataRetiradaPretendida || new Date()}
          />
        )}

        {(dataRetiradaPretendida || dataEntregaPretendida) && (
          <CheckBox
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            title="Permitir que o transportador sugira datas diferentes"
            checked={negociaDatas}
            onPress={() => setNegociaDatas(!negociaDatas)}
          />
        )}
        <Text style={styles.label}>Endereços:</Text>
        <View style={styles.enderecoContainer}>
          <TouchableOpacity
            style={styles.labelEnderecoContainer}
            onPress={handleToggleEnderecoRetiradaVisible}
          >
            <Text style={[styles.label, styles.labelEndereco]}>
              Endereço de partida *
            </Text>

            {isEnderecoRetiradaVisible && (
              <Image
                style={[styles.setaCollapse]}
                source={iconeSetaCima}
                resizeMode="center"
              />
            )}
            {!isEnderecoRetiradaVisible && (
              <Image
                style={styles.setaCollapse}
                source={iconeSetaBaixo}
                resizeMode="center"
              />
            )}
          </TouchableOpacity>

          {isEnderecoRetiradaVisible && (
            <View>
              {formSubmetido && errors.enderecoRetiradaCep !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoRetiradaCep}`}
                </Text>
              )}
              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoRetiradaCep
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoRetiradaCep}
                onChangeText={(text) => setEnderecoRetiradaCep(text)}
                placeholder="CEP *"
                keyboardType="numeric"
                maxLength={8}
                onBlur={() => buscaCep(enderecoRetiradaCep, "enderecoRetirada")}
              />

              {formSubmetido && errors.enderecoRetiradaLogradouro !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoRetiradaLogradouro}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoRetiradaLogradouro
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoRetiradaLogradouro}
                onChangeText={(text) => setEnderecoRetiradaLogradouro(text)}
                placeholder="Logradouro *"
                maxLength={120}
              />

              {formSubmetido && errors.enderecoRetiradaNumero !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoRetiradaNumero}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoRetiradaNumero
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoRetiradaNumero}
                onChangeText={(text) => setEnderecoRetiradaNumero(text)}
                placeholder="Número *"
                maxLength={20}
              />

              {formSubmetido && errors.enderecoRetiradaBairro !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoRetiradaBairro}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoRetiradaBairro
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoRetiradaBairro}
                onChangeText={(text) => setEnderecoRetiradaBairro(text)}
                placeholder="Bairro *"
                maxLength={50}
              />

              {formSubmetido && errors.enderecoRetiradaComplemento !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoRetiradaComplemento}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoRetiradaComplemento
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoRetiradaComplemento}
                onChangeText={(text) => setEnderecoRetiradaComplemento(text)}
                placeholder="Complemento"
                maxLength={120}
              />

              <View style={styles.selectGroup}>
                {formSubmetido && errors.enderecoRetiradaUf !== "" && (
                  <Text style={styles.textoValidacao}>
                    {`\b${errors.enderecoRetiradaUf}`}
                  </Text>
                )}
                <View style={styles.selectContainer}>
                  <Picker
                    selectedValue={JSON.stringify(enderecoRetiradaUf)}
                    onValueChange={(value) => {
                      handleChangeValueEnderecoRetiradaUf(
                        JSON.parse(value.toString() || "{}")
                      );
                    }}
                  >
                    <Picker.Item value="" key="" label="UF *" />
                    {estados.map((estado: UF) => (
                      <Picker.Item
                        key={estado.sigla}
                        label={estado.nome}
                        value={JSON.stringify(estado)}
                      />
                    ))}
                  </Picker>
                </View>

                {formSubmetido && errors.enderecoRetiradaCidade !== "" && (
                  <Text style={styles.textoValidacao}>
                    {`\b${errors.enderecoRetiradaCidade}`}
                  </Text>
                )}
                <View
                  style={[
                    styles.selectContainer,
                    Object.entries(enderecoRetiradaUf).length === 0 &&
                      styles.disabled,
                  ]}
                >
                  <Picker
                    enabled={Object.entries(enderecoRetiradaUf).length > 0}
                    selectedValue={JSON.stringify(enderecoRetiradaCidade)}
                    onValueChange={(value) => {
                      handleChangeValueEnderecoRetiradaCidade(
                        JSON.parse(value.toString() || "{}")
                      );
                    }}
                  >
                    <Picker.Item
                      value=""
                      key=""
                      label="Cidade *"
                      color={
                        Object.entries(enderecoRetiradaUf).length === 0
                          ? "#000000a8"
                          : ""
                      }
                    />
                    {cidadesEnderecoRetirada.map((cidade: Cidade) => (
                      <Picker.Item
                        key={cidade.id}
                        label={cidade.nome}
                        value={JSON.stringify(cidade)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.enderecoContainer}>
          <TouchableOpacity
            style={styles.labelEnderecoContainer}
            onPress={handleToggleEnderecoEntregaVisible}
          >
            <Text style={[styles.label, styles.labelEndereco]}>
              Endereço de entrega *
            </Text>
            {isEnderecoEntregaVisible && (
              <Image
                style={styles.setaCollapse}
                source={iconeSetaCima}
                resizeMode="center"
              />
            )}
            {!isEnderecoEntregaVisible && (
              <Image
                style={styles.setaCollapse}
                source={iconeSetaBaixo}
                resizeMode="center"
              />
            )}
          </TouchableOpacity>

          {isEnderecoEntregaVisible && (
            <View>
              {formSubmetido && errors.enderecoEntregaCep !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoEntregaCep}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoEntregaCep
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoEntregaCep}
                onChangeText={(text) => setEnderecoEntregaCep(text)}
                placeholder="CEP *"
                keyboardType="numeric"
                maxLength={8}
                onBlur={() => buscaCep(enderecoEntregaCep, "enderecoEntrega")}
              />

              {formSubmetido && errors.enderecoEntregaLogradouro !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoEntregaLogradouro}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoEntregaLogradouro
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoEntregaLogradouro}
                onChangeText={(text) => setEnderecoEntregaLogradouro(text)}
                placeholder="Logradouro *"
                maxLength={120}
              />

              {formSubmetido && errors.enderecoEntregaNumero !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoEntregaNumero}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoEntregaNumero
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoEntregaNumero}
                onChangeText={(text) => setEnderecoEntregaNumero(text)}
                placeholder="Número *"
                maxLength={20}
              />

              {formSubmetido && errors.enderecoEntregaBairro !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoEntregaBairro}`}
                </Text>
              )}
              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoEntregaBairro
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoEntregaBairro}
                onChangeText={(text) => setEnderecoEntregaBairro(text)}
                placeholder="Bairro *"
                maxLength={50}
              />

              {formSubmetido && errors.enderecoEntregaComplemento !== "" && (
                <Text style={styles.textoValidacao}>
                  {`\b${errors.enderecoEntregaComplemento}`}
                </Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  formSubmetido && errors.enderecoEntregaComplemento
                    ? styles.inputError
                    : null,
                ]}
                value={enderecoEntregaComplemento}
                onChangeText={(text) => setEnderecoEntregaComplemento(text)}
                placeholder="Complemento"
                maxLength={120}
              />

              <View style={styles.selectGroup}>
                {formSubmetido && errors.enderecoEntregaUf !== "" && (
                  <Text style={styles.textoValidacao}>
                    {`\b${errors.enderecoEntregaUf}`}
                  </Text>
                )}
                <View style={styles.selectContainer}>
                  <Picker
                    selectedValue={JSON.stringify(enderecoEntregaUf)}
                    onValueChange={(value) => {
                      handleChangeValueEnderecoEntregaUf(
                        JSON.parse(value.toString() || "{}")
                      );
                    }}
                  >
                    <Picker.Item value="" key="" label="UF *" />
                    {estados.map((estado: UF) => (
                      <Picker.Item
                        key={estado.sigla}
                        label={estado.nome}
                        value={JSON.stringify(estado)}
                      />
                    ))}
                  </Picker>
                </View>

                {formSubmetido && errors.enderecoEntregaCidade !== "" && (
                  <Text style={styles.textoValidacao}>
                    {`\b${errors.enderecoEntregaCidade}`}
                  </Text>
                )}
                <View
                  style={[
                    styles.selectContainer,
                    Object.entries(enderecoEntregaUf).length === 0 &&
                      styles.disabled,
                  ]}
                >
                  <Picker
                    enabled={Object.entries(enderecoEntregaUf).length > 0}
                    selectedValue={JSON.stringify(enderecoEntregaCidade)}
                    onValueChange={(value) => {
                      handleChangeValueEnderecoEntregaCidade(
                        JSON.parse(value.toString() || "{}")
                      );
                    }}
                  >
                    <Picker.Item
                      value=""
                      key=""
                      label="Cidade *"
                      color={
                        Object.entries(enderecoEntregaUf).length === 0
                          ? "#000000a8"
                          : ""
                      }
                    />
                    {cidadesEnderecoEntrega.map((cidade: Cidade) => (
                      <Picker.Item
                        key={cidade.id}
                        label={cidade.nome}
                        value={JSON.stringify(cidade)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          )}
        </View>

        <RectButton
          enabled={formPreenchido}
          style={[styles.button, !formPreenchido ? styles.disabled : null]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </RectButton>

        <Loader loading={loading} />

        <Overlay
          overlayStyle={{ width: "90%" }}
          isVisible={visible}
          onBackdropPress={toggleOverlay}
        >
          <Text style={{ lineHeight: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              {`Erro ao consumir API: \n`}
            </Text>
            <Text>{erroApi}</Text>
          </Text>
        </Overlay>
      </ScrollView>
    </View>
  );
}

export default SolicitacaoFrete;
