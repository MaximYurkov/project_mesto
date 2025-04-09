// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

// DOM узлы
const profile = document.querySelector(".profile");
const profileEditButton = profile.querySelector(".profile__edit-button");
const profileAddButton = profile.querySelector(".profile__add-button");
const profileTitle = profile.querySelector(".profile__title");
const profileDescription = profile.querySelector(".profile__description");

// Функции открытия и закрытия поп-апов
function openPopup(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEsc);
}

function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeByEsc);
}

// Работа с поп-апом профиля
const popupEditProfile = document.querySelector(".popup_type_edit");
const profileFormElement = popupEditProfile.querySelector(".popup__form");
const profileNameInput = profileFormElement.querySelector(
  ".popup__input_type_name"
);
const profileDescriptionInput = profileFormElement.querySelector(
  ".popup__input_type_description"
);

profileEditButton.addEventListener("click", () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(popupEditProfile);
});

profileNameInput.value = profileTitle.textContent;
profileDescriptionInput.value = profileDescription.textContent;

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(popupEditProfile);
}
profileFormElement.addEventListener("submit", handleProfileFormSubmit);

// Работа с поп-апом добавления карточек
profileAddButton.addEventListener("click", () => {
  openPopup(popupNewCard);
});

const popupNewCard = document.querySelector(".popup_type_new-card");
const newCardFormElement = popupNewCard.querySelector(".popup__form");
const newCardNameInput = newCardFormElement.querySelector(
  ".popup__input_type_card-name"
);
const newCardUrlInput = newCardFormElement.querySelector(
  ".popup__input_type_url"
);

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  placesList.prepend(
    createCard({ name: newCardNameInput.value, link: newCardUrlInput.value })
  );
  closePopup(popupNewCard);
}
newCardFormElement.addEventListener("submit", handleCardFormSubmit);

// Поп-ап для осмотра картинки
const popupImage = document.querySelector(".popup_type_image");
const popupImagePicture = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");

// Функция создания карточки
function createCard(obj) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardElementTitle = cardElement.querySelector(".card__title");
  const cardElementImage = cardElement.querySelector(".card__image");

  const cardElementLikeButton = cardElement.querySelector(".card__like-button");
  const cardElementDeleteButton = cardElement.querySelector(
    ".card__delete-button"
  );

  cardElementTitle.textContent = obj.name;
  cardElementImage.src = obj.link;
  cardElementImage.alt = "Изображение: " + obj.name;

  cardElementImage.addEventListener("click", () => {
    popupImagePicture.src = obj.link;
    popupImagePicture.alt = "Изображение: " + obj.name;
    popupImageCaption.textContent = obj.name;

    openPopup(popupImage);
  });

  cardElementLikeButton.addEventListener("click", () =>
    cardElementLikeButton.classList.toggle("card__like-button_is-active")
  );

  cardElementDeleteButton.addEventListener("click", () => {
    const placesItem = cardElementDeleteButton.closest(".places__item");
    placesItem.remove();
  });

  return cardElement;
}

// Вывод карточек на страницу
initialCards.forEach((obj) => placesList.append(createCard(obj)));

// Функция для закрытия поп-апа через Esc
function closeByEsc(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closePopup(openedPopup);
  }
}

// Добавить общий функционал кнопкам закрытия всех поп-апов + анимация
const popups = document.querySelectorAll(".popup");
Array.from(popups).forEach((popup) => {
  const popupCloseButton = popup.querySelector(".popup__close");
  popup.classList.add("popup_is-animated");

  popupCloseButton.addEventListener("click", () => {
    closePopup(popup);
  });

  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

// Валидация
const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  console.log(`.${inputElement.name}-error`);
  inputElement.classList.add("popup__input_type_error");
  errorElement.textContent = errorMessage;
  errorElement.classList.add("popup__input-error_active");
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  inputElement.classList.remove("popup__input_type_error");
  errorElement.classList.remove("popup__input-error_active");
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".popup__input"));
  const buttonElement = formElement.querySelector(".popup__button");
  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".popup__form"));
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.setAttribute("disabled", "");
  } else {
    buttonElement.removeAttribute("disabled");
  }
};

enableValidation();