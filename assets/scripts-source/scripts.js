const axiosConfig = {
  headers: {
    "x-gravitee-transaction-id": "69705fe6-8380-4886-b05f-e6838018869d",
  },
};
function loading(status) {
  if (status) {
    document.getElementById("loading").classList.add("show");
  } else {
    document.getElementById("loading").classList.remove("show");
  }
}
function clearSelectOptions(selectID, selectText) {
  var element = document.getElementById(selectID);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  var option = document.createElement("option");
  let optionText = document.createTextNode(selectText);
  option.appendChild(optionText);
  document.getElementById(selectID).appendChild(option);
}

function clearHTMLPlans() {
  var element = document.getElementById("plans");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function handleCurrentSelect(elementID) {
  let e = document.getElementById(elementID);
  let elementSelectd = e.options[e.selectedIndex].value;

  return elementSelectd;
}

axios
  .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then(function (response) {
    const stateInitials = response.data;
    stateInitials.map((stateInitial) => {
      const createOption = document.createElement("option");
      let optionText = document.createTextNode(stateInitial.sigla);
      createOption.value = stateInitial.sigla;
      createOption.appendChild(optionText);
      document.getElementById("selectState").appendChild(createOption);
    });
  });

function handleState(selectedState) {
  axios
    .get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`
    )
    .then(function (response) {
      const cityInitials = response.data;

      clearSelectOptions("selectCity", "Cidade");
      clearSelectOptions("selectProfession", "Profissão");

      cityInitials.map((cityInitial) => {
        const createOption = document.createElement("option");
        let optionText = document.createTextNode(cityInitial.nome);
        createOption.value = cityInitial.nome;
        createOption.appendChild(optionText);
        document.getElementById("selectCity").appendChild(createOption);
      });
    });
}

function handleCity() {
  let selectedValueState = handleCurrentSelect("selectState");
  let selectedValueCity = handleCurrentSelect("selectCity");

  axios
    .get(
      `https://apisimulador.qualicorp.com.br/profissao/${selectedValueState}/${selectedValueCity}?api-key=eebc059d-6838-4762-8e28-d2f726753866`
    )
    .then(function (response) {
      const professionInitials = response.data;

      clearSelectOptions("selectProfession", "Profissão");

      professionInitials.map((professionInitial) => {
        const createOption = document.createElement("option");
        let optionText = document.createTextNode(professionInitial.profissao);
        createOption.value = professionInitial.profissao;
        createOption.appendChild(optionText);
        document.getElementById("selectProfession").appendChild(createOption);
      });
    });
}

function getEntity() {
  let selectedValueState = handleCurrentSelect("selectState");
  let selectedValueCity = handleCurrentSelect("selectCity");
  let selectedValueProfession = handleCurrentSelect("selectProfession");

  axios
    .get(
      `https://apisimulador.qualicorp.com.br/entidade/${selectedValueProfession}/${selectedValueState}/${selectedValueCity}?api-key=f1e6c49a-ca38-45d7-984a-616ff4fb458a`,
      axiosConfig
    )
    .then(function (response) {
      const entityInitials = response.data;
      entityInitials.map((entity) => {
        const createInput = document.getElementById("inputEntity");
        createInput.value = entity.NomeFantasia;
      });
    });
}

function handleSubmit() {
  let selectedValueState = handleCurrentSelect("selectState");
  let selectedValueCity = handleCurrentSelect("selectCity");
  let inputValueEntity = document.getElementById("inputEntity").value;

  let inputValueBirthDay = document.getElementById("inputBirthDay").value;
  let inputValueBirthMonth = document.getElementById("inputBirthMonth").value;
  let inputValueBirthYear = document.getElementById("inputBirthYear").value;

  if (inputValueBirthDay || inputValueBirthMonth || inputValueBirthYear) {
    inputValueBirth === undefined;
  }

  let inputValueBirth = `${inputValueBirthYear}-${inputValueBirthMonth}-${inputValueBirthDay}`;

  if (
    selectedValueState &&
    selectedValueCity &&
    inputValueEntity &&
    inputValueBirth
  ) {
    document.getElementById("buttonSubmit").classList.add("no-click");
    clearHTMLPlans();
    loading(true);
    axios
      .post(
        "https://apisimulador.qualicorp.com.br/plano?api-key=47acfdec-048b-40a1-b826-d867199ac786",
        {
          entidade: inputValueEntity,
          uf: selectedValueState,
          cidade: selectedValueCity,
          datanascimento: [inputValueBirth],
        },
        axiosConfig
      )
      .then(function (response) {
        if (response.status === 200) {
          loading(false);
          document.getElementById("buttonSubmit").classList.remove("no-click");

          const plansInitials = response.data;

          plansInitials.planos.map((plan, index) => {
            console.log(plan);
            const createArticle = document.createElement("article");
            createArticle.classList.add("plan");
            createArticle.setAttribute("id", `id${plan.id}${index}`);
            document.getElementById("plans").appendChild(createArticle);

            var html = `
            <div>
              <img src="${plan.operadoraLogo}" alt="${plan.operadora}" />
            </div>
            <div class="plan__infos">
              <h1 id="plano" class="plan__title">${plan.plano}</h1>
              <p class="tipo_acomodacao">
                <strong>Acomodação:</strong> ${plan.tipo_acomodacao}
              </p>
              <p class="segmentacao">
                <strong>Segmentação:</strong> ${plan.segmentacao}
              </p>
              <p class="abrangencia"><strong>Abrangencia:</strong> ${
                plan.abrangencia
              }</p>
              <p class="precos"><strong>R$ ${plan.precos.total}</strong></p>
              ${plan.precos.precos.map(
                (preco) =>
                  `<table class="plan__prices">
                <tr>
                  <th>Idade</th>
                  <th>Preço</th>
                  <th>Faixa</th>
                </tr>
                <tr>
                  <td>${preco.idade}</td>
                  <td>R$ ${preco.preco}</td>
                  <td>de <span>${preco.de}</span> até <span>${preco.ate}</span></td>
                </tr>
                </table>`
              )}
            </div>

            `;
            document.getElementById(`id${plan.id}${index}`).innerHTML = html;
          });
        } else {
          alert(
            "Houve um problema na hora de buscar so dados, verifique todos os campos e tente novamente"
          );
        }
      })
      .catch(function (error) {
        console.log(error);
        document.getElementById("loading").innerHTML =
          "Houve um erro, verifique a data de nascimento e tente novamente";
        document.getElementById("buttonSubmit").classList.remove("no-click");
      });
  } else {
    alert("Todos os campos são obrigatórios.");
  }
}
