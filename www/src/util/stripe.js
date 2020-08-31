/*
      This file (stripe.js) is added to your codebase if you chose "None" for your
      payments provider when exporting from Divjoy, but some of you components attempt 
      to import stripe.js and use its functions. That's why it's still here, but does nothing.
    */

const errorMessage = `Payments is disabled because you chose "None" when picking a payments option in Divjoy. You can adjust this option on the Divjoy homepage or you can remove this component if you don't need payments.`;

export async function redirectToCheckout(planId) {
  alert(errorMessage);
}

export async function redirectToBilling() {
  alert(errorMessage);
}
