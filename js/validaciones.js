document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".formulario");
    const firstNameInput = document.getElementById("primerNombre");
    const lastNameInput = document.getElementById("primerApellido");
    const documentTypeInput = document.getElementsByName("tipoDocumento");
    const documentNumberInput = document.getElementById("numeroDocumento");
    const addressInput = document.getElementById("direccion");
    const fotoInput = document.getElementById("foto");
    const previewFoto = document.getElementById("previewFoto");
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        validateForm();
    });
    form.addEventListener("reset", function () {
        clearErrors();
        updateSummary();
    });
    documentTypeInput.forEach(function (input) {
        input.addEventListener("change", function () {
            toggleDocumentNumberField();
        });
    });
    function validateForm() {
        clearErrors();
        validateFirstName();
        validateLastName();
        validateDocumentType();
        validateDocumentNumber();
        validateAddress();
        validateEmail();
        validateBirthday();
        validatePostalCode();
        validatePassword("claveSecreta");
    }
    function toggleDocumentNumberField() {
        const selectedDocumentType = Array.from(documentTypeInput).find(
            (input) => input.checked
        );
        documentNumberInput.disabled = !selectedDocumentType;
        if (!documentNumberInput.disabled) {
            documentNumberInput.value = "";
        }
    }
    function clearErrors() {
        const errorElements = document.querySelectorAll(".form__error");
        errorElements.forEach(function (errorElement) {
            errorElement.textContent = "";
            errorElement.classList.remove("show"); // Remover la clase para ocultar con transición
        });
        updateSummary();
    }

    function showError(fieldId, errorMessage) {
        const errorElement = document.getElementById(`error${fieldId}`);
        errorElement.textContent = errorMessage;
        errorElement.classList.add("show"); // Agregar la clase para mostrar con transición
        updateSummary();
    }
    function updateSummary() {
        const errorElements = document.querySelectorAll(".form__error.show");
        const formSummary = document.getElementById("formSummary");

        if (errorElements.length > 0) {
            const errorFields = Array.from(errorElements)
                .map((element, index) => {
                    const parentContainer = element.closest(".campo");
                    const labelContent =
                        parentContainer.querySelector(".form__label");
                    const errorMessage = labelContent
                        ? labelContent.textContent.replace(":", "").trim()
                        : "";
                    return index === 0
                        ? capitalizeFirstLetter(errorMessage)
                        : errorMessage.toLowerCase();
                })
                .filter((field) => field !== ""); // Filtrar campos vacíos

            const summaryText = `Se encontraron errores en: ${joinWithAnd(errorFields)}.`;
            formSummary.textContent = summaryText;
            formSummary.style.display = "block";
        } else {
            formSummary.textContent = "";
            formSummary.style.display = "none";
        }
    }

    function joinWithAnd(arr) {
        if (arr.length === 1) {
            return arr[0];
        } else if (arr.length === 2) {
            return `${arr[0]} y ${arr[1]}`;
        } else {
            const lastItem = arr.pop();
            return `${arr.join(", ")}, y ${lastItem}`;
        }
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0)+ str.slice(1);
    }
    function validateFirstName() {
        const firstNameValue = firstNameInput.value.trim();

        if (firstNameValue.length > 0) {
            const firstNameRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ][a-záéíóúüñÑ]*$/;

            if (
                !firstNameRegex.test(firstNameValue) ||
                firstNameValue.length < 3 ||
                firstNameValue.length > 10
            ) {
                showError(
                    "PrimerNombre",
                    "Debe tener entre 3 y 10 caracteres. No se permiten espacios vacíos."
                );
            }
        }
    }

    function validateLastName() {
        const lastNameValue = lastNameInput.value.trim();
        const lastNameRegex = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ',.]+$/;

        if (
            lastNameValue.length < 2 ||
            lastNameValue.length > 20 ||
            !lastNameRegex.test(lastNameValue)
        ) {
            showError(
                "PrimerApellido",
                "Debe tener entre 2 y 20 caracteres. No se permiten espacios vacíos."
            );
        }
    }

    function validateDocumentType() {
        const selectedDocumentType = Array.from(documentTypeInput).find(
            (input) => input.checked
        );

        if (!selectedDocumentType) {
            showError("TipoDocumento", "Debe seleccionar DNI o CUIL.");
        }
    }

    function validateDocumentNumber() {
        const selectedDocumentType = Array.from(documentTypeInput).find(
            (input) => input.checked
        );

        if (selectedDocumentType && !documentNumberInput.disabled) {
            const documentNumberValue = documentNumberInput.value.trim();

            const allowedCharactersRegex = /^[0-9\-]+(?:\.[0-9]{3}){0,2}$/;

            if (!allowedCharactersRegex.test(documentNumberValue)) {
                showError(
                    "NumeroDocumento",
                    "Solo se permiten números, puntos (como separadores de miles para DNI) y guiones (para CUIL)."
                );
                return;
            }

            if (selectedDocumentType.value === "dni") {
                // Validación adicional para 1 o 2 dígitos
                if (documentNumberValue.length < 3) {
                    showError(
                        "NumeroDocumento",
                        'Debe contener entre 7 y 10 dígitos(si usas "."). Ej: "1234567", "12345678", "1.234.567", "12.234.567".'
                    );
                    return;
                }

                const dniRegex = /^(?:\d{1,2}(?:\.\d{3}){0,2}|(?:\d{7,8}))$/;

                if (!dniRegex.test(documentNumberValue)) {
                    showError(
                        "NumeroDocumento",
                        'Debe contener entre 7 y 10 dígitos(si usas "."). Ej: "1234567", "12345678", "1.234.567", "12.234.567".'
                    );
                }
            } else if (selectedDocumentType.value === "cuil") {
                const cuilRegex = /^(?:\d{11}|\d{2}-\d{7,8}-\d{1})$/;

                if (!cuilRegex.test(documentNumberValue)) {
                    showError(
                        "NumeroDocumento",
                        'Debe contener entre 11 y 13 dígitos. Ej: "20123456789", "20-01234567-9", "20-12345678-9", "20-12345678-9" '
                    );
                }
            }
        }
    }

    function validateAddress() {
        const addressValue = addressInput.value.trim();
        const addressRegex = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s0-9,.'°"/()-]+$/;
        if (
            addressValue.length > 0 &&
            (addressValue.length < 10 ||
                addressValue.length > 200 ||
                !addressRegex.test(addressValue))
        ) {
            showError(
                "Direccion",
                "Debe tener entre 10 y 200 caracteres y solo contener caracteres permitidos."
            );
        }
    }

    function validateEmail() {
        const emailValue = document.getElementById("email").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue.length > 0 && !emailRegex.test(emailValue)) {
            showError("Email", "Ingrese un correo electrónico válido.");
        }
    }

    function validateBirthday() {
        const birthdayInput = document.getElementById("Birthday");
        const errorBirthday = document.getElementById("errorBirthday");

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        const birthDate = new Date(birthdayInput.value);
        const birthYear = birthDate.getFullYear();
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();

        let age = currentYear - birthYear;

        if (
            currentMonth < birthMonth ||
            (currentMonth === birthMonth && currentDay < birthDay)
        ) {
            age--;
        }

        if (age < 18) {
            errorBirthday.textContent = "Debes ser mayor de 18 años.";
        } else {
            errorBirthday.textContent = "";
        }
    }

    function validatePostalCode() {
        const codigoPostalValue = document
            .getElementById("codigoPostal")
            .value.trim();
        const codigoPostalRegex = /^\d{4}$/;

        if (
            codigoPostalValue.length > 0 &&
            !codigoPostalRegex.test(codigoPostalValue)
        ) {
            showError(
                "CodigoPostal",
                "Ingrese un código postal válido (4 dígitos)."
            );
        }
    }

    function validatePassword(inputId) {
        const claveSecretaInput = document.getElementById(inputId);
        const icon = claveSecretaInput.nextElementSibling;
        const errorElement = document.getElementById("errorPassword");

        icon.addEventListener("click", function () {
            if (claveSecretaInput.type === "password") {
                claveSecretaInput.type = "text";
                icon.style.opacity = 0.8;
                errorElement.textContent = "";
            } else {
                claveSecretaInput.type = "password";
                icon.style.opacity = 0.3;
                errorElement.textContent = "";
            }
        });
    }

    validatePassword("claveSecreta");

    fotoInput.addEventListener("change", function () {
        previewImage();
    });

    form.addEventListener("reset", function () {
        clearPreview();
    });

    function previewImage() {
        const fotoFile = fotoInput.files[0];

        if (fotoFile) {
            const reader = new FileReader();

            reader.onload = function (e) {
                previewFoto.src = e.target.result;
                previewFoto.style.display = "block";
            };

            reader.readAsDataURL(fotoFile);
        } else {
            clearPreview();
        }
    }

    function clearPreview() {
        previewFoto.src = "";
        previewFoto.style.display = "none";
    }
});
