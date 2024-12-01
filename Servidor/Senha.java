public class Senha {
    private String senha;

    public Senha(String s)throws Exception{
        if(s == null) throw new Exception("String nulo!");
        this.senha = s;
    }

    public boolean contemMaiuscula(){
        for(int i = 0; i < this.senha.length(); i++){
            if(Character.isUpperCase(this.senha.charAt(i))) return true;
        }
        return false;
    }

    public boolean contemNumero(){
        for(int i = 0; i < this.senha.length(); i++){
            if(Character.isDigit(this.senha.charAt(i))) return true;
        }
        return false;
    }

    public boolean contemCaracterEspecial(){
        char[] caracteresEspeciais = {'!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '|', '\\', ':', ';', '"', '\'', '<', '>', ',', '.', '?', '/'};
        for(int i = 0; i < this.senha.length(); i++){
            for(int j = 0; j < caracteresEspeciais.length; j++){
                if(this.senha.charAt(i) == caracteresEspeciais[j]) return true;
            }
        }
        return false;
    }

    public boolean contemOito(){
        if(this.senha.length() < 8) return false;
        return true;
    }

    public boolean isSenhaValida(){
        if(!this.contemMaiuscula()) return false;
        if(!this.contemCaracterEspecial()) return false;
        if(!this.contemNumero()) return false;
        if(!this.contemOito()) return false;

        return true;
    }

    @Override
    public String toString(){
        return this.senha;
    }

    @Override
    public boolean equals(Object obj){
        if(obj == this) return true;
        if(obj == null) return false;
        if(obj.getClass()!=this.getClass()) return false;

        Senha s = (Senha)obj;
        if(!s.senha.equals(this.senha)) return false;
        return true;
    }

    @Override
    public int hashCode(){
        int ret = 4;
        ret = ret*7+this.senha.hashCode();
        if (ret < 0) ret = -ret;
        return ret;
    }
}