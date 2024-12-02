import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Teste {
    public static void main(String[] args) {

        final int port = 8080;

        try (ServerSocket serverSocket = new ServerSocket(port)) {

            System.out.println("Server listening on port " + port);

            while (true) {
                Socket socket = serverSocket.accept();
                System.out.println("New client connected");
                Linha linha = new Linha(socket);
                linha.start();
            }
        } catch (IOException e) {
            System.err.println("Servidor exception: " + e.getMessage());
        }
    }
}