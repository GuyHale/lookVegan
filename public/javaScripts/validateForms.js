//form validation function, think this is from bootstrap but I can't remember
//either way, this is responsible for either allowing the form to submit or preventing that event when some
//condition isn't met

(function () {
    'use strict'
    console.log("validate form running")

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()