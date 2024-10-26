{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # scripts
        bunbuild = pkgs.writeShellScriptBin "bunbuild" ''
          bun run build
        '';

        bundev = pkgs.writeShellScriptBin "bundev" ''
          bun run dev
        '';

        bunstart = pkgs.writeShellScriptBin "bunstart" ''
          bun run start
        '';

        buntest = pkgs.writeShellScriptBin "buntest" ''
          bun run test
        '';
      in
      with pkgs; {
        devShell = mkShell {
          buildInputs = [
            # list whatever packages you need
            # search for packages at https://search.nixos.org/

            # formatting for .nix files
            nixpkgs-fmt

            # binaries
            nodejs_22
            bun
            playwright-driver.browsers # node package version and this must match

            # custom scripts defined above
            bunbuild
            bundev
            bunstart
            buntest

            nodePackages.svelte-language-server
          ];

          shellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}

            bun install
          '';
        };
      }
    );
}
