import Chat from "@/components/chat";
import Layout from "@/components/layout";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      <motion.div
        className="w-full max-w-4xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <Chat />
      </motion.div>
    </Layout>
  );
}
