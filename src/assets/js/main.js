window.darkMode = true;

const stickyClasses = ["fixed", "h-14"];
const unstickyClasses = ["absolute", "h-20"];
const stickyClassesContainer = [
	"border-b",
	"backdrop-blur-xl",
	"sticky-active",
];
const unstickyClassesContainer = ["border-transparent"];
let headerElement = null;

document.addEventListener("DOMContentLoaded", () => {
	headerElement = document.getElementById("header");

	const stored = localStorage.getItem("dark_mode");
	if (stored === "false") {
		window.darkMode = false;
		showDay();
	} else {
		window.darkMode = true;
		showNight();
	}

	stickyHeaderFuncionality();
	applyMenuItemClasses();
	evaluateHeaderPosition();
	mobileMenuFunctionality();
});

window.stickyHeaderFuncionality = () => {
	window.addEventListener("scroll", () => {
		evaluateHeaderPosition();
	});
};

window.evaluateHeaderPosition = () => {
	if (window.scrollY > 16) {
		headerElement.firstElementChild.classList.add(...stickyClassesContainer);
		headerElement.firstElementChild.classList.remove(...unstickyClassesContainer);
		headerElement.classList.add(...stickyClasses);
		headerElement.classList.remove(...unstickyClasses);
		document.getElementById("menu").classList.add("top-[56px]");
		document.getElementById("menu").classList.remove("top-[75px]");
	} else {
		headerElement.firstElementChild.classList.remove(...stickyClassesContainer);
		headerElement.firstElementChild.classList.add(...unstickyClassesContainer);
		headerElement.classList.add(...unstickyClasses);
		headerElement.classList.remove(...stickyClasses);
		document.getElementById("menu").classList.remove("top-[56px]");
		document.getElementById("menu").classList.add("top-[75px]");
	}
};

document.getElementById("darkToggle").addEventListener("click", () => {
	document.documentElement.classList.add("duration-300");

	if (document.documentElement.classList.contains("dark")) {
		localStorage.setItem("dark_mode", "false");
		showDay(true);
	} else {
		localStorage.removeItem("dark_mode");
		showNight(true);
	}
});

function showDay(animate) {
	document.getElementById("sun").classList.remove("setting");
	document.getElementById("moon").classList.remove("rising");

	let timeout = 0;
	if (animate) {
		timeout = 500;
		document.getElementById("moon").classList.add("setting");
	}

	setTimeout(() => {
		document.getElementById("moon").classList.add("hidden");
		document.getElementById("sun").classList.remove("hidden");

		if (animate) {
			document.documentElement.classList.remove("dark");
			document.getElementById("sun").classList.add("rising");
		}
	}, timeout);
}

function showNight(animate) {
	document.getElementById("moon").classList.remove("setting");
	document.getElementById("sun").classList.remove("rising");

	let timeout = 0;
	if (animate) {
		timeout = 500;
		document.getElementById("sun").classList.add("setting");
	}

	setTimeout(() => {
		document.getElementById("sun").classList.add("hidden");
		document.getElementById("moon").classList.remove("hidden");

		if (animate) {
			document.documentElement.classList.add("dark");
			document.getElementById("moon").classList.add("rising");
		}
	}, timeout);
}

window.applyMenuItemClasses = () => {
	const menuItems = document.querySelectorAll("#menu a");
	for (let i = 0; i < menuItems.length; i++) {
		if (menuItems[i].pathname === window.location.pathname) {
			menuItems[i].style.color = "var(--gold-light)";
		}
	}
};

function mobileMenuFunctionality() {
	document.getElementById("openMenu").addEventListener("click", () => {
		openMobileMenu();
	});
	document.getElementById("closeMenu").addEventListener("click", () => {
		closeMobileMenu();
	});
}

window.openMobileMenu = () => {
	const openBtn = document.getElementById("openMenu");
	const closeBtn = document.getElementById("closeMenu");
	openBtn.classList.add("hidden");
	openBtn.setAttribute("aria-expanded", "true");
	closeBtn.classList.remove("hidden");
	closeBtn.setAttribute("aria-expanded", "true");
	document.getElementById("menu").classList.remove("hidden");
	document.getElementById("mobileMenuBackground").classList.add("opacity-0");
	document.getElementById("mobileMenuBackground").classList.remove("hidden");

	setTimeout(() => {
		document.getElementById("mobileMenuBackground").classList.remove("opacity-0");
	}, 1);
};

window.closeMobileMenu = () => {
	const openBtn = document.getElementById("openMenu");
	const closeBtn = document.getElementById("closeMenu");
	closeBtn.classList.add("hidden");
	closeBtn.setAttribute("aria-expanded", "false");
	openBtn.classList.remove("hidden");
	openBtn.setAttribute("aria-expanded", "false");
	document.getElementById("menu").classList.add("hidden");
	document.getElementById("mobileMenuBackground").classList.add("hidden");
};

// Escape-to-close mobile menu.
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		const menu = document.getElementById("menu");
		if (menu && !menu.classList.contains("hidden")) {
			window.closeMobileMenu();
			document.getElementById("openMenu")?.focus();
		}
	}
});
