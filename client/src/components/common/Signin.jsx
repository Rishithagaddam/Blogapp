import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import '../auth/Auth.css'

function Signin() {
  return (
    <div className="auth-container">
      <SignIn 
        routing="path" 
        path="/signin" 
        signUpUrl="/signup"
        redirectUrl="/"
        appearance={{
          elements: {
            card: 'cl-card',
            headerTitle: 'cl-headerTitle',
            headerSubtitle: 'cl-headerSubtitle',
            footerAction: 'cl-footerAction',
            formButtonPrimary: 'cl-formButtonPrimary',
            formFieldInput: 'cl-formFieldInput',
            formFieldLabel: 'cl-formFieldLabel',
            footerActionLink: 'cl-footerActionLink',
            socialButtonsProviderIcon: 'cl-socialButtonsProviderIcon',
            socialButtonsButton: 'cl-socialButtonsButton',
            socialButtonsProviderText: 'cl-socialButtonsProviderText',
            dividerText: 'cl-dividerText',
            dividerLine: 'cl-dividerLine'
          }
        }}
      />
    </div>
  )
}

export default Signin