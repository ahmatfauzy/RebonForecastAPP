import argparse
import json
import sys
from pathlib import Path

server_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(server_dir))

from app.main import app

repo_root = server_dir.parents[1]
output_path = repo_root / "packages/contracts/src/openapi.json"
schema_text = json.dumps(app.openapi(), ensure_ascii=False, indent=2) + "\n"

parser = argparse.ArgumentParser(description="Export the FastAPI OpenAPI schema.")
parser.add_argument("--check", action="store_true", help="Fail when the committed schema is stale.")
args = parser.parse_args()

if args.check:
    if not output_path.exists() or output_path.read_text(encoding="utf-8") != schema_text:
        print("OpenAPI schema is stale. Run `bun run api:generate`.", file=sys.stderr)
        raise SystemExit(1)
else:
    output_path.write_text(schema_text, encoding="utf-8")
