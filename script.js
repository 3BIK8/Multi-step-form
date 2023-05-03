function getElementById(id) {
	return document.getElementById(id);
}

const nameInput = getElementById("name");
const emailInput = getElementById("email");
const phoneInput = getElementById("phone");
const nameError = getElementById("name_error");
const emailError = getElementById("email_error");
const phoneError = getElementById("phone_error");
const s1Form = getElementById("s1_form");
const inputItems = document.querySelectorAll(".input_item");
const sections = document.querySelectorAll(".section");
const nextButtons = document.querySelectorAll(".next_button");
const backButtons = document.querySelectorAll(".back_button");
const navItemNumbers = document.querySelectorAll(".nav_item_number");
const inputFields = [
	{ element: nameInput, errorElement: nameError, type: "name" },
	{ element: emailInput, errorElement: emailError, type: "email" },
	{ element: phoneInput, errorElement: phoneError, type: "phone" },
];
let userInfo = {};

// This function checks if all input fields are valid
function isFormValid() {
	return inputFields.every((input) => input.element.validity.valid);
}

// This function handles the validation of input fields and displays any errors
function handleInputValidation(input, error, key) {
	if (input.validity.valid) {
		error.style.display = "none";
		userInfo[key] = input.value;
		input.style.borderColor = "var(--Purplish-blue)";
	} else {
		error.style.display = "inline";
		input.style.borderColor = "var(--Strawberry-red)";
	}
}
const firstNextButton = nextButtons[0];

// This event listener listens for the form submit and validates all input fields
nextButtons.forEach((nextButton) => {
	nextButton.addEventListener("click", (event) => {
		console.log("t");
		event.preventDefault(); // prevent default behavior
		inputFields.forEach(({ element, errorElement, type }) => {
			// validate input fields
			handleInputValidation(element, errorElement, type);
		});
		if (isFormValid()) {
			document.querySelector(".name").innerHTML = userInfo.name; // display name in summary section
			document.querySelector(".email").innerHTML = userInfo.email; // display email in summary section
			document.querySelector(".phone").innerHTML = userInfo.phone; // display phone number in summary section
		}
	});
});

// This event listener listens for input on all input fields and validates them
inputFields.forEach(({ element, errorElement, type }) => {
	element.addEventListener("input", () => {
		handleInputValidation(element, errorElement, type);
	});
});

// This function displays a section based on its index
function showSection(index) {
	if (index <= 3) {
		navItemNumbers[index].style.backgroundColor = "var(--Light-blue)";
		navItemNumbers[index].style.color = "black";
	}
	sections[index].style.display = "block";
}

// This function hides a section based on its index
function hideSection(index) {
	if (index <= 3) {
		navItemNumbers[index].style.backgroundColor = ""; // reset background color of nav item
		navItemNumbers[index].style.color = "white"; // set text color of nav item number to white
	}
	sections[index].style.display = "none";
}

showSection(0); // Show the first section by default

for (let i = 1; i <= 4; i++) {
	// hides other sections by default
	hideSection(i);
}

// This event listener listens for clicks on all "next" buttons and displays the next section
nextButtons.forEach((button, i) => {
	button.addEventListener("click", () => {
		if (i === 0 && !isFormValid()) {
			// if the first section is not valid, do not proceed
			return;
		}
		if (i === 1 && !storeSelectedPlan()) {
			// if the selected plan is not stored, do not proceed
			planUnits.forEach((planUnit) => {
				planUnit.style.borderColor = "var(--Strawberry-red)"; // set border color of plan units to red
			});
			return false;
		}
		if (i === 2) {
			// if it is the third section, call this function
			logSelectedAddOns();
		}
		hideSection(i); // hide the current section
		showSection(i + 1); // show the next section
	});
});

for (let i = 0; i < backButtons.length; i++) {
	backButtons[i].addEventListener("click", () => {
		hideSection(i + 1);
		showSection(i);
	});
}

// plan section
const planPayments = document.querySelectorAll(".plan_payment");
const monthlyLabel = document.querySelector("#monthly-label");
const yearlyLabel = document.querySelector("#yearly-label");
const planUnits = document.querySelectorAll(".plan_unit");
const sliderInput = document.querySelector("#toggle");
const freebiesElements = document.querySelectorAll(".freebies");
const monthlyPrices = [9, 12, 15];
const yearlyPrices = monthlyPrices.map((price) => price * 10);

let selectedPlan = {};

// Define a function that sets the border color of a plan unit element
const setPlanBorderColor = (planUnit, color) => {
	planUnit.style.borderColor = color;
};

// Define a function that shows/hides the freebies section depending on the visibility flag
const toggleFreebiesVisibility = (isVisible) => {
	freebiesElements.forEach((element) => {
		element.style.display = isVisible ? "block" : "none";
	});
};

// Define a function that updates the plan prices based on the slider value
const updatePlanPrices = (sliderValue) => {
	planPayments.forEach((planPayment, index) => {
		const price =
			sliderValue === "monthly" ? monthlyPrices[index] : yearlyPrices[index];
		planPayment.textContent = `$${price}/${
			sliderValue === "monthly" ? "mn" : "yr"
		}`;
	});
};

// Define a function that checks if a plan is selected
const isPlanSelected = () => {
	return Object.keys(selectedPlan).length !== 0;
};

// Define a function that stores the selected plan
storeSelectedPlan = () => {
	if (isPlanSelected()) {
		return true;
	}
};

// Define a function that updates the selected plan price based on the selected plan unit
const updateSelectedPlanPrice = () => {
	const selectedPlanUnit = document.querySelector(
		".plan_unit[style='border-color: var(--Marine-blue);']"
	);
	if (selectedPlanUnit) {
		const selectedPlanPayment =
			selectedPlanUnit.querySelector(".plan_payment").textContent;
		selectedPlan.price = selectedPlanPayment;
	}
};

// Attach a click event listener to each plan unit
planUnits.forEach((planUnit) => {
	planUnit.addEventListener("click", () => {
		handlePlanSelection(planUnit);
	});
});

// Attach a change event listener to the slider input element
sliderInput.addEventListener("change", () => {
	planUnits.forEach((planUnit) => {
		// Reset the selected plan and plan unit border colors
		planUnit.style.borderColor = "";
	});
	selectedPlan = {};

	// Update the plan prices and freebies visibility based on the slider value
	const sliderValue = sliderInput.checked ? "yearly" : "monthly";

	updatePlanPrices(sliderValue);
	toggleFreebiesVisibility(sliderInput.checked);

	// Update the color of the slider labels based on the slider value
	yearlyLabel.style.color = sliderInput.checked
		? "var(--Marine-blue)"
		: "var(--Cool-gray)";
	monthlyLabel.style.color = sliderInput.checked
		? "var(--Cool-gray)"
		: "var(--Marine-blue)";

	// Update the selected plan price
	updateSelectedPlanPrice();
});

// Define a function that handles a plan selection event
const handlePlanSelection = (planUnit) => {
	// Set the border of the selected plan unit
	setPlanBorderColor(planUnit, "var(--Purplish-blue)");

	planUnits.forEach((unit) => {
		if (unit !== planUnit) {
			setPlanBorderColor(unit, "var(--Cool-gray)");
		}
	});
	selectedPlan.name = planUnit.querySelector(".plan_title").textContent;
	selectedPlan.price = planUnit.querySelector(".plan_payment").textContent;
	toggleFreebiesVisibility(sliderInput.checked);
	updateSelectedPlanPrice();
};
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
const addOnCheckboxes = document.querySelectorAll(
	'.add-ons input[type="checkbox"]'
);
const addOnContainer = document.querySelector(".add-ons");
const selectedAddOns = [];

addOnContainer.addEventListener("click", function (event) {
	const addOn = event.target.closest(".add-on_box");
	if (!addOn) return;
	const checkbox = addOn.querySelector('input[type="checkbox"]');
	checkbox.checked = !checkbox.checked;
	addOn.classList.toggle("selected");
	// logSelectedAddOns();
});

// Log the selected add-ons
function logSelectedAddOns() {
	// Clear out previous selections
	selectedAddOns.length = 0;

	// Get all checked checkboxes
	const addOnCheckboxes = document.querySelectorAll(
		".add-on_box input[type='checkbox']:checked"
	);
	for (const checkbox of addOnCheckboxes) {
		// Find the corresponding add-on box
		const addOnBox = checkbox.closest(".add-on_box");

		// Extract the add-on information
		const name = addOnBox.querySelector(".add-on_title").textContent;
		const price = addOnBox.querySelector(".add-on_price").textContent;

		// Add the add-on to the selectedAddOns array
		selectedAddOns.push({ name, price });
	}

	fillReceipt(selectedPlan.name, selectedPlan.price, selectedAddOns);
}

function fillReceipt(planTitle, planPrice, selectedAddOns) {
	// Fill in plan title and price
	const planTitleElement = document.querySelector(".plan_selected_title");
	const planPriceElement = document.querySelector(".plan_price");
	planTitleElement.textContent =
		planTitle + (sliderInput.checked ? "(Yearly)" : "(Monthly)");
	planPriceElement.textContent = planPrice;

	// Clear out previous add-ons
	const addOnsContainer = document.getElementById("add-ons-container");
	addOnsContainer.innerHTML = "";

	// Fill in selected add-ons
	for (const addOn of selectedAddOns) {
		const template = document.getElementById("add-ons_selected-template");
		const clone = template.content.cloneNode(true);
		const titleElement = clone.querySelector(".add_on_selected_title");
		const priceElement = clone.querySelector(".add_on_selected_price");
		titleElement.textContent = addOn.name;
		priceElement.textContent = addOn.price;
		addOnsContainer.appendChild(clone);
	}

	// Calculate and fill in total payment
	const totalPayment = document.querySelector(".total_payment");
	const totalElement = totalPayment.querySelector(".total");
	const totalPriceElement = totalPayment.querySelector(".total_price");

	// Calculate total cost of plan and addons
	let totalCost = parseFloat(planPrice.substring(1));
	for (const addOn of selectedAddOns) {
		const addonPrice = addOn.price.substring(1);
		totalCost += parseFloat(addonPrice);
	}

	totalElement.textContent =
		"Total:" + (sliderInput.checked ? "(per year)" : "(per month)");
	totalPriceElement.textContent = `$${totalCost.toFixed(2)}`;
}

// Show section #s2 and hide current section when "change" button is clicked
const changePlanButton = document.querySelector(".change_plan");
changePlanButton.addEventListener("click", () => {
	showSection(1);
	hideSection(3);
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const addOnsContainer = document.querySelector(".add-ons");
const addOnTemplate = document.querySelector("#add-on-template");

const addOnsData = [
	{
		title: "Online service",
		description: "Access to multiplayer games.",
		monthlyPrice: "$1/mn",
		yearlyPrice: "$10/yr",
	},
	{
		title: "Larger storage",
		description: "Extra 1TB of cloud save.",
		monthlyPrice: "$2/mn",
		yearlyPrice: "$20/yr",
	},
	{
		title: "Customizable profile",
		description: "Custom theme on your profile",
		monthlyPrice: "$2/mn",
		yearlyPrice: "$20/yr",
	},
];

function updatePrices() {
	const isYearly = sliderInput.checked;
	addOnsData.forEach((addOn) => {
		addOn.price = isYearly ? addOn.yearlyPrice : addOn.monthlyPrice;
	});
	const addOnElements = document.querySelectorAll(".add-on_box");
	addOnElements.forEach((addOnElement, index) => {
		addOnElement.querySelector(".add-on_price").textContent =
			addOnsData[index].price;
	});
}

sliderInput.addEventListener("change", updatePrices);

addOnsData.forEach((addOn) => {
	const addOnElement = addOnTemplate.content.cloneNode(true);
	addOnElement.querySelector(".add-on_title").textContent = addOn.title;
	addOnElement.querySelector(".add-on_desc").textContent = addOn.description;
	addOnElement.querySelector(".add-on_price").textContent = addOn.monthlyPrice;
	addOnsContainer.appendChild(addOnElement);
});
