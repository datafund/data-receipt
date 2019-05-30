# consent-generator

Generate a consent receipt (CR) JSON. 

## Quick Use :running_woman:‍

```sh
import ConsentGenerator from 'consent-generator';

<ConsentGenerator formData={{"test": "lorem ipsum"}} APIroot={"http://localhost:5000/api/v1/"} verifyOptions={{
            issuer: 'issuer',
            subject: 'subject',
            audience: 'audience',
            expiresIn: "12h",
            algorithm: "RS256"
}} />
```

## Props :hammer_and_wrench:
- `formData` (json)
- `APIroot` (string)
- `verifyOptions` (json)
  
