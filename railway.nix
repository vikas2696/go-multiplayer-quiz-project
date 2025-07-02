{ pkgs }:
pkgs.mkShell {
  buildInputs = [
    pkgs.go_1_21
  ];
}
