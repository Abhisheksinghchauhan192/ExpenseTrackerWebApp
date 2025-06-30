function showModal(isSuccess = true) {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        // Change styling based on success/failure
        modal.classList.toggle('success-modal', isSuccess);
        modal.classList.toggle('error-modal', !isSuccess);
        document.body.style.overflow = 'hidden';
    }
}

function hideModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const action = urlParams.get('action');
    
    const successMessages = {
        'created': 'User successfully registered!',
        'updated': 'Username successfully updated!',
        'deleted': 'User successfully deleted!',
        'loggedIn': 'User successfully logged in!'
    };
    
    const errorMessages = {
        'userNotExists': 'User does not exist. Please try with Valid credentials .',
        'wrongPassword': 'Wrong password. Please try again.',
        'error':'Something Went Wrong Please Try again laer..',
        'missingFields':"Fill all fields !",
        'invalidEmail':"Invalid Email",
        'databaseError':"Try Again Database issue",
        'emailExists':"User Already Exists",
        'unauthorized':"You Are Not Authorised To Access The Resources "
    };
    
    if (action) {
        const modal = document.getElementById('successModal');
        const modalTitle = modal.querySelector('h3');
        const modalMessage = modal.querySelector('p');
        
        if (success === 'true' && successMessages[action]) {
            // Success case
            modalTitle.textContent = action === 'deleted' ? 'Done!' : 'Success!';
            modalMessage.textContent = successMessages[action];
            showModal(true);
        } 
        else if (errorMessages[action]) {
            // Error case
            modalTitle.textContent = 'Error!';
            modalMessage.textContent = errorMessages[action];
            showModal(false);
        }
        
        setTimeout(() => {
            hideModal();
            history.replaceState(null, '', window.location.pathname);
        }, 2000);
    }
});
