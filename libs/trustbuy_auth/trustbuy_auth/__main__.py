"""`python -m trustbuy_auth` - idempotent dev-keypair bootstrap, run from
each service's container entrypoint before the app starts (see
infra/docker/entrypoint-*.sh)."""

from __future__ import annotations

import os
from pathlib import Path

from trustbuy_auth.keys import ensure_keypair

if __name__ == "__main__":
    if os.environ.get("JWT_PRIVATE_KEY") and os.environ.get("JWT_PUBLIC_KEY"):
        # Keys supplied directly (required for separate cloud services with
        # no shared disk - see jwt.py) - nothing to generate on disk.
        print("[trustbuy_auth] Using JWT_PRIVATE_KEY/JWT_PUBLIC_KEY from environment.")
    else:
        private_path = Path(os.environ.get("JWT_PRIVATE_KEY_PATH", "/keys/private.pem"))
        public_path = Path(os.environ.get("JWT_PUBLIC_KEY_PATH", "/keys/public.pem"))
        created = ensure_keypair(private_path, public_path)
        if created:
            print(f"[trustbuy_auth] Generated dev RSA keypair at {private_path} / {public_path}")
        else:
            print(f"[trustbuy_auth] Using existing RSA keypair at {private_path} / {public_path}")
