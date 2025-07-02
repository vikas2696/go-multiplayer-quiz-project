{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "go-app";

  src = ./.;

  buildInputs = [ pkgs.go_1_21 ];

  buildPhase = ''
    cd backend
    go build -o server .
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp backend/server $out/bin/
  '';
}
