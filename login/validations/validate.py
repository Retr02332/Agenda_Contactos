"""
Esta función valida el username, y el password. Si alguno de estos 
no pasa la validación, se devolvera el nombre del campo afectado.
"""
def validate_signup(username: str, password: str, confirm_password: str) -> str:
    if password != confirm_password:
        return "invalid_password"

    elif len(username) not in range(1,11):
        return "invalid_username"

    else:
        return "ok"