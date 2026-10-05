document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Sticky Header on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial trigger

    // --- Hero Quick Loan Estimator ---
    const quickAmount = document.getElementById('quickAmount');
    const quickAmountVal = document.getElementById('quickAmountVal');
    const quickEmiResult = document.getElementById('quickEmiResult');
    const quickLoanType = document.getElementById('quickLoanType');

    function updateQuickEstimator() {
        const principal = parseFloat(quickAmount.value);
        quickAmountVal.textContent = `$${principal.toLocaleString()}`;

        let annualRate = 8.5;
        const type = quickLoanType.value;
        if (type === 'business') annualRate = 11.2;
        if (type === 'personal') annualRate = 10.5;
        if (type === 'education') annualRate = 9.0;

        const monthlyRate = annualRate / 12 / 100;
        const tenureMonths = 60; // 5 years

        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        quickEmiResult.textContent = `$${Math.round(emi).toLocaleString()} /mo`;
    }

    if (quickAmount) {
        quickAmount.addEventListener('input', updateQuickEstimator);
        quickLoanType.addEventListener('change', updateQuickEstimator);
        updateQuickEstimator();
    }

    // --- Eligibility Checker Logic ---
    const eligibilityForm = document.getElementById('eligibilityForm');
    const eligibilityResult = document.getElementById('eligibilityResult');
    const eligibleAmount = document.getElementById('eligibleAmount');

    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const income = parseFloat(document.getElementById('monthlyIncome').value);
            const existingEmi = parseFloat(document.getElementById('existingEmi').value) || 0;
            const disposableIncome = income - existingEmi;

            if (disposableIncome <= 0) {
                alert('Existing EMIs exceed or equal your monthly income. Please review your entries.');
                return;
            }

            // Estimate eligible loan amount based on disposable income
            const maxEmi = disposableIncome * 0.50; // 50% FOIR
            const monthlyRate = 9.5 / 12 / 100;
            const tenureMonths = 180; // 15 years
            const maxLoan = (maxEmi * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));

            eligibleAmount.textContent = `$${Math.round(maxLoan).toLocaleString()}`;
            eligibilityResult.classList.remove('hidden');
        });
    }

    // --- Advanced EMI Calculator Logic ---
    const calcLoanRange = document.getElementById('calcLoanRange');
    const calcLoanInput = document.getElementById('calcLoanInput');
    const calcRateRange = document.getElementById('calcRateRange');
    const calcRateInput = document.getElementById('calcRateInput');
    const calcTenureRange = document.getElementById('calcTenureRange');
    const calcTenureInput = document.getElementById('calcTenureInput');

    const resMonthlyEmi = document.getElementById('resMonthlyEmi');
    const resPrincipal = document.getElementById('resPrincipal');
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');

    function calculateAdvancedEMI() {
        const principal = parseFloat(calcLoanRange.value);
        const annualRate = parseFloat(calcRateRange.value);
        const tenureYears = parseFloat(calcTenureRange.value);

        calcLoanInput.value = principal.toLocaleString();
        calcRateInput.value = annualRate;
        calcTenureInput.value = tenureYears;

        const monthlyRate = annualRate / 12 / 100;
        const tenureMonths = tenureYears * 12;

        let emi = 0;
        let totalPayment = 0;
        let totalInterest = 0;

        if (monthlyRate === 0) {
            emi = principal / tenureMonths;
            totalPayment = principal;
            totalInterest = 0;
        } else {
            emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
            totalPayment = emi * tenureMonths;
            totalInterest = totalPayment - principal;
        }

        resMonthlyEmi.textContent = `$${Math.round(emi).toLocaleString()}`;
        resPrincipal.textContent = `$${Math.round(principal).toLocaleString()}`;
        resInterest.textContent = `$${Math.round(totalInterest).toLocaleString()}`;
        resTotal.textContent = `$${Math.round(totalPayment).toLocaleString()}`;
    }

    if (calcLoanRange) {
        calcLoanRange.addEventListener('input', () => {
            calcLoanRange.value = calcLoanInput.value.replace(/,/g, '');
            calculateAdvancedEMI();
        });
        calcLoanInput.addEventListener('input', () => {
            const val = parseFloat(calcLoanInput.value.replace(/,/g, ''));
            if (!isNaN(val)) {
                calcLoanRange.value = val;
                calculateAdvancedEMI();
            }
        });

        calcRateRange.addEventListener('input', calculateAdvancedEMI);
        calcTenureRange.addEventListener('input', calculateAdvancedEMI);

        calculateAdvancedEMI();
    }

    // --- Login Modal Toggle ---
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your loan inquiry has been submitted successfully. A Stackly advisor will contact you shortly.');
            contactForm.reset();
        });
    }
});