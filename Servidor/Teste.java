import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class Teste {
    public static void main(String[] args) {

        final int port = 8080;

        try (ServerSocket serverSocket = new ServerSocket(port)) {

            System.out.println("Server listening on port " + port);

            while (true) {
                Socket conexao = serverSocket.accept();
                System.out.println("New client connected");

                BufferedReader reader = new BufferedReader(new InputStreamReader(conexao.getInputStream()));

                PrintWriter writer = new PrintWriter(conexao.getOutputStream());

                

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
                    System.err.println("Gerador exception: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Gerador exception: " + e.getMessage());
        }
    }
}