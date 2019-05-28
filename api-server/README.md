# Sample node.js BE to generate Consent receipt JWT token

## API Resources



### POST /token

Example: http://localhost:5000/api/v1/token

Request payload:

    {
        {"test": "lorem ipsum"}
    }

Response body:

    {
        "data": {
            "success": "true"
            "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoibG9yZW0gaXBzdW0iLCJwdWJsaWNLZXkiOiItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxuTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFuenlpczFaamZOQjBiQmdLRk1TdlxudmtUdHdsdkJzYUpxN1M1d0Era3plVk9WcFZXd2tXZFZoYTRzMzhYTS9wYS95cjQ3YXY3K3ozVlRtdkRSeUFIY1xuYVQ5MndoUkVGcEx2OWNqNWxUZUpTaWJ5ci9Ncm0vWXRqQ1pWV2dhT1lJaHdyWHdLTHFQci8xMWluV3NBa2ZJeVxudHZIV1R4WllFY1hMZ0FYRnVVdWFTM3VGOWdFaU5Rd3pHVFUxdjBGcWtxVEJyNEI4blczSENONDdYVXUwdDhZMFxuZStsZjRzNE94UWF3V0Q3OUo5LzVkM1J5MHZiVjNBbTFGdEdKaUp2T3dSc0lmVkNoRHBZU3RUY0hUQ01xdHZXYlxuVjZMMTFCV2twekdYU1c0SHY0M3FhK0dTWU9EMlFVNjhNYjU5b1NrMk9CK0J0T0xwSm9mbWJHRUdndm13eUNJOVxuTXdJREFRQUJcbi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLSIsImlhdCI6MTU1OTA0ODU0MywiZXhwIjoxNTU5MDkxNzQzLCJhdWQiOiJhdWRpZW5jZSIsImlzcyI6Imlzc3VlciIsInN1YiI6InN1YmplY3QifQ.ECSlr4oOc3YeCw_aqICMRlvFvQU4dfJtT4vDEhduUsbk6VC_lafchnpCXt9hxhcEE2n8e4izEOSIVH9aVjOKd0mDihezq1zhBNS11BkMe4EkEbmkBU8JNoJo6eIoG5Va5S4cZZllreomM-EixHyvByc8FYNrydDotKTNA4EVX3CPBi0nDRyx_s1PuGLeczuFZ-IEkC-oOtckMh6rgyQ-Jttz0Pw5fIofUTvij9h2f9fs3bye3A73wSiCvQw03Pn3zBcrr3VhnpMU37nP1e3nH19d_zp5U4M4nMUAkJMwlD1dHYs-ykmHciK-XbmAxUGa9cu7vQhKk1pNThU-Ih22yA"
        }
    }


### GET /publicKey

Example: http://localhost:5000/api/v1/publicKey

Response body:

    {
        "data": {
            "success": "true"
            "key": "-----BEGIN PUBLIC KEY-----↵MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnzyis1ZjfNB0bBgKFMSv↵vkTtwlvBsaJq7S5wA+kzeVOVpVWwkWdVha4s38XM/pa/yr47av7+z3VTmvDRyAHc↵aT92whREFpLv9cj5lTeJSibyr/Mrm/YtjCZVWgaOYIhwrXwKLqPr/11inWsAkfIy↵tvHWTxZYEcXLgAXFuUuaS3uF9gEiNQwzGTU1v0FqkqTBr4B8nW3HCN47XUu0t8Y0↵e+lf4s4OxQawWD79J9/5d3Ry0vbV3Am1FtGJiJvOwRsIfVChDpYStTcHTCMqtvWb↵V6L11BWkpzGXSW4Hv43qa+GSYOD2QU68Mb59oSk2OB+BtOLpJofmbGEGgvmwyCI9↵MwIDAQAB↵-----END PUBLIC KEY-----"
        }
    }
