{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      pname = "cake";
      entry = "app.ts";

      ags-bin =
        with ags.packages.${system};
        (default.override {
          extraPackages = [
            apps
            astal4
            battery
            bluetooth
            hyprland
            io
            mpris
            network
            notifd
            powerprofiles
            wireplumber
          ];
        });
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        name = pname;
        src = ./.;

        nativeBuildInputs = with pkgs; [
          ags-bin
          gobject-introspection
          wrapGAppsHook
        ];

        buildInputs = [ pkgs.gjs ];

        installPhase = ''
          runHook preInstall

          mkdir -p $out/bin
          mkdir -p $out/share
          cp -r * $out/share
          ags bundle ${entry} $out/bin/${pname} -d "SRC='$out/share'"

          runHook postInstall
        '';
      };

      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          ags-bin
          corepack
          nixfmt-rfc-style
          nodejs
        ];
      };

      formatter.${system} =
        with pkgs;
        writeShellScriptBin "format" ''
          ${corepack}/bin/pnpm install --frozen-lockfile
          ${corepack}/bin/pnpm run format:fix

          ${nixfmt-rfc-style}/bin/nixfmt ./flake.nix
        '';
    };
}
