import ast
import os
import glob


def test_core_and_engine_never_import_features():
    """
    Architectural Dependency Test.
    Parses Python AST of all files under /app/engine and /app/core.
    Asserts zero imports of '/app/features' or 'app.features'.
    """
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    core_files = glob.glob(os.path.join(project_root, "app", "core", "**", "*.py"), recursive=True)
    engine_files = glob.glob(os.path.join(project_root, "app", "engine", "**", "*.py"), recursive=True)

    files_to_check = core_files + engine_files
    assert len(files_to_check) > 0, "No files found to inspect"

    forbidden_imports = []

    for filepath in files_to_check:
        with open(filepath, "r", encoding="utf-8") as f:
            tree = ast.parse(f.read(), filename=filepath)

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if "features" in alias.name:
                        forbidden_imports.append((filepath, alias.name))
            elif isinstance(node, ast.ImportFrom):
                if node.module and "features" in node.module:
                    forbidden_imports.append((filepath, node.module))

    assert len(forbidden_imports) == 0, f"Architecture boundary violated! Core/Engine imported features: {forbidden_imports}"
