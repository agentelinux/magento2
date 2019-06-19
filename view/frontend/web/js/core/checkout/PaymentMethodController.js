var PaymentMethodController = function (methodCode) {
   this.methodCode = methodCode;
};

PaymentMethodController.prototype.init = function () {
    var paymentMethodInit = this.methodCode + 'Init';
    this[paymentMethodInit]();
};

PaymentMethodController.prototype.formObject = function (formObject) {
    this.formObject = formObject
};

PaymentMethodController.prototype.formValidation = function () {
    formValidation = this.methodCode + 'Validation';

    return this[formValidation]();
};

PaymentMethodController.prototype.creditcardInit = function () {
    this.formObject = FormObject.creditCardInit();

    this.modelToken = new CreditCardToken(this.formObject);
};

PaymentMethodController.prototype.boletoInit = function () {
};

PaymentMethodController.prototype.initBin = function (obj) {
    if (this.methodCode != 'creditcard') {
        return;
    }
    this.addCreditCardListeners(FormObject.creditCardInit(), obj)
}

PaymentMethodController.prototype.addCreditCardListeners = function (formObject, obj ) {
    bin = new Bin();
    formHandler = new FormHandler();
    installments = new Installments();

    formObject.creditCardNumber.on('keyup', function () {
        setTimeout(function(){
            bin.init(formObject.creditCardNumber.val());
            installments.init(bin);
            formHandler.init(formObject);
            formHandler.switchBrand(bin.selectedBrand);

            obj.getInstallmentsByBrand(
                bin.selectedBrand,
                installments.addOptions
            );
        }, 1300);
    });

    formObject.creditCardNumber.on('change', function () {
        bin.init(jQuery(this).val());
    });
};

/**
 * @todo Move other validations from platform to here
 */
PaymentMethodController.prototype.creditCardValidation = function () {
    if (
        typeof this.formObject != "undefined" &&
        typeof this.formObject.creditCardBrand.val() != "undefined" &&
        this.formObject.creditCardBrand.val().length > 0
    ) {
        return true
    }

    return false;
};


// @todo Mover to another class

PaymentMethodController.prototype.getCreditCardToken = function (pkKey, success, error) {

    if (this.creditCardValidation()) {
        this.modelToken
            .getToken(pkKey)
            .done(success)
            .fail(error);
    }
}