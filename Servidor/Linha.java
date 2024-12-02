import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class Linha extends Thread{
    private Socket socket;
    public Linha(Socket s){
        this.socket = s;
    }

    @Override
    public void run(){
        try{
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            PrintWriter writer = new PrintWriter(socket.getOutputStream());

            try {
                String password = reader.readLine();
                System.out.println("Senha: " + password);

                Senha p = new Senha(password);
                if (p.isSenhaValida()){
                    System.out.println("Senha valida");
                    writer.println("True");
                }
                else{
                    System.out.println("Senha invalida");
                    writer.println("False");
                }
                
                writer.flush();
            } catch (Exception e) {
                System.err.println("Validação exception: " + e.getMessage());
            }
        } catch(Exception erro) {
            System.err.println("I/O exception: " + erro.getMessage());
        }

    }
}
